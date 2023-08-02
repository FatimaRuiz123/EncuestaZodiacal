import { TDocumentDefinitions } from './../../../../node_modules/@types/pdfmake/interfaces.d';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterPipe } from './filter.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { kmeans } from 'ml-kmeans';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake'; // Importar pdfMake correctamente
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';

export interface KMeansOptions {
  maxIterations: number;
  initialization: 'random' | 'kmeans++';
  distanceFunction: (p: number[], q: number[]) => number;
}
// Registrar las fuentes en pdfMake
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

interface Cluster {
  centroid: number[];
  points: number[][];
}

export interface KMeansResult {
  clusters: Cluster[];
  centroids: number[][];
}


export interface Pregunta {
  id: number;
  texto: string;
}

export interface Respuesta {
  _id: { $oid: string };
  nombre: string;
  encuesta: {
    pregunta: string;
    idpregunta: number;
    respuesta: string;
    idrespuesta: number;
    _id: { $oid: string };
  }[];
}

function euclidean(p: number[], q: number[]): number {
  return Math.sqrt(p.reduce((acc, val, i) => acc + (val - q[i]) ** 2, 0));
}

function manhattan(p: number[], q: number[]): number {
  return p.reduce((acc, val, i) => acc + Math.abs(val - q[i]), 0);
}

function cosine(p: number[], q: number[]): number {
  const dotProduct = p.reduce((acc, val, i) => acc + val * q[i], 0);
  const magnitudeP = Math.sqrt(p.reduce((acc, val) => acc + val ** 2, 0));
  const magnitudeQ = Math.sqrt(q.reduce((acc, val) => acc + val ** 2, 0));
  return 1 - dotProduct / (magnitudeP * magnitudeQ);
}

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent implements OnInit, OnDestroy {
  preguntas: Pregunta[] = [];
  respuestas: Respuesta[] = [];
  filtroNombre: string = '';

   myEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  private unsubscribe$ = new Subject<void>();
  kmeansTrained: any;
  result: KMeansResult | any;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) {
    this.kmeansTrained = new EventEmitter<any>();
  }
  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }

  ngOnInit() {
    this.obtenerPreguntas();
    this.obtenerRespuestas();
  }

  obtenerPreguntas() {
    this.http.get<Pregunta[]>('http://localhost:3000/preguntas').subscribe(data => {
      this.preguntas = data;
    });
  }

  obtenerRespuestas() {
    this.http.get<Respuesta[]>('http://localhost:3000/respuestas').subscribe(data => {
      this.respuestas = data;
    });
  }

  obtenerRespuestaNombre(respuesta: Respuesta, preguntaId: number): string {
    const respuestaPregunta = respuesta.encuesta.find(pregunta => pregunta.idpregunta === preguntaId);
    return respuestaPregunta ? respuestaPregunta.respuesta : '';
  }

  entrenar() {
    const dataMatrix: number[][] = [];

    // Recorrer las respuestas para obtener los datos de entrenamiento
    for (const respuesta of this.respuestas) {
      const rowData: number[] = [];

      for (const encuestaItem of respuesta.encuesta) {
        rowData.push(encuestaItem.idpregunta); // Coordenada X (idpregunta)
        rowData.push(encuestaItem.idrespuesta); // Coordenada Y (idrespuesta)
      }

      dataMatrix.push(rowData);
    }

    // Ahora tienes la matriz dataMatrix con los datos adecuados para el entrenamiento
    console.log(dataMatrix);

    // Configurar las opciones para k-means
    const options: KMeansOptions = {
      maxIterations: 100,
      initialization: 'random',
      distanceFunction: euclidean // Opciones válidas: euclidean, manhattan, cosine
    };

    // Luego puedes utilizar ml-kmeans para entrenar tu modelo con esta matriz...
    // Por ejemplo, entrenar el modelo con k=2 (2 clusters)
    const k = 2;
    const result = kmeans(dataMatrix, k, options);

    // Emitir el resultado a través de un evento para que otros componentes puedan recibirlo
    this.kmeansTrained.emit(result)
    // result.centroids: Un array con las coordenadas de los centroides de cada cluster
    console.log('Centroids:', result.centroids);

    // result.clusters: Un array con las asignaciones de cada punto a su cluster
    console.log('Clusters:', result.clusters);

    this.router.navigate(['/entrenamiento'], {
      state: { centroids: JSON.stringify(result.centroids), clusters: JSON.stringify(result.clusters) }
    });
  }

  exportarExcel() {
    const data: any[][] = [];
    const headers: any[] = ['Nombre', ...this.preguntas.map(pregunta => pregunta.texto)];

    data.push(headers);

    this.respuestas.forEach(respuesta => {
      const rowData: any[] = [respuesta.nombre];
      this.preguntas.forEach(pregunta => {
        rowData.push(this.obtenerRespuestaNombre(respuesta, pregunta.id));
      });
      data.push(rowData);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tabla Datos');

    // Agregar los datos a la hoja de cálculo
    data.forEach(rowData => {
      worksheet.addRow(rowData);
    });

    // Estilos para el encabezado (cabecera) de la tabla
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: '00000' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E3BFFE' } };

    // Estilos para el contenido de la tabla (excluyendo el encabezado)
    for (let row = 2; row <= data.length; row++) {
      const contentRow = worksheet.getRow(row);
      contentRow.font = { bold: false };
      contentRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
    }

    // Ajustar el ancho de las columnas (opcional)
    worksheet.columns.forEach(column => {
      column.width = 15;
    });


    // Generar el archivo Excel y descargarlo
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'tabla_datos.xlsx');
    });
  }

    exportarPDF() {
      const columns = ['Nombre', ...this.preguntas.map(pregunta => pregunta.texto)];
      const rows: string[][] = [];

      this.respuestas.forEach(respuesta => {
        const rowData = [respuesta.nombre];
        this.preguntas.forEach(pregunta => {
          rowData.push(this.obtenerRespuestaNombre(respuesta, pregunta.id));
        });
        rows.push(rowData);
      });

      const tableBody = [columns, ...rows];

      const docDefinition: any = {
        pageOrientation: 'landscape',
        content: [
          { text: 'Tabla de Datos', style: 'header' },
          {
            table: {
              headerRows: 1,
              widths: Array(columns.length).fill('*'),
              body: tableBody,
            },
            style: 'table',
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            color: '#000000',
            margin: [0, 10, 0, 10], // Ajusta los márgenes superior e inferior según lo necesites
          },
          table: {
            fontSize: 5, // Ajustar el tamaño del texto de la tabla
            color: 'blue',
          },
        },
      };

      this.generarPDF(docDefinition); // Llamar a la función para generar el PDF
    }
    generarPDF(docDefinition: any) {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      // Opción 1: Abre el PDF en una nueva ventana del navegador
      pdfDocGenerator.open();
    }

  }
