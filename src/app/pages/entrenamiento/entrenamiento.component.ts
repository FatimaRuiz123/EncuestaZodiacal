import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake'; // Importar pdfMake correctamente
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as d3 from 'd3';



@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.component.html',
  styleUrls: ['./entrenamiento.component.scss']
})
export class EntrenamientoComponent implements OnInit {
  @ViewChild('graficaD3') graficaD3Ref?: ElementRef<SVGElement>;
  centroids: number[][] | undefined;
  clusters: Cluster[] | undefined;
  @ViewChild('graficaD3', { static: true }) graficaD3!: ElementRef<SVGSVGElement>;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if (state) {
      this.centroids = JSON.parse(state['centroids']);
      this.clusters = JSON.parse(state['clusters']);
      // this.centroids = [
      //   [3, 4],
      //   [7, 8]
      // ];

      // this.clusters = [
      //   { x: 2, y: 5 },
      //   { x: 4, y: 6 },
      //   { x: 6, y: 7 },
      //   { x: 8, y: 9 },
      // ];
    }

  }

  ngOnInit(): void {
    // Aquí puedes usar los datos de centroids y clusters para mostrar el gráfico de KMeans en la pantalla
    console.log('Centroids:', this.centroids);
    console.log('Clusters:', this.clusters);
    this.mostrarGrafico();

  }

  calcularPorcentajeClustering(): number[] {
    const clusterCounts = [0, 0, 0, 0]; // Inicializamos el arreglo para contar cuántos puntos hay en cada clúster
    if (this.clusters) {
      for (const cluster of this.clusters) {
        // Asumimos que el clúster asignado está en la propiedad "cluster" de cada objeto "Cluster"
        clusterCounts[cluster.cluster]++;
      }
    }

    const totalPoints = this.clusters ? this.clusters.length : 0; // Total de puntos asignados a clústeres
    const percentages = clusterCounts.map((count) => (count / totalPoints) * 100);

    return percentages;
  }

  // Si deseas volver a la pantalla anterior, puedes usar esta función
  volverATabla() {
    this.router.navigate(['/tabla']);
  }

  private mostrarGrafico(): void {
    const svg = d3.select(this.graficaD3.nativeElement);

    const width = 400; // Tamaño del ancho del gráfico
    const height = 300; // Tamaño del alto del gráfico
    const margin = { top: 30, right: 30, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', width)
       .attr('height', height);

    const xScale = d3.scaleLinear()
                     .domain([0, 10]) // Ajusta el dominio según tus datos reales
                     .range([margin.left, innerWidth]);

    const yScale = d3.scaleLinear()
                     .domain([0, 10]) // Ajusta el dominio según tus datos reales
                     .range([innerHeight, margin.top]);

    const g = svg.append('g')
                 .attr('transform', `translate(${margin.left},${margin.top})`);

    // Agregar ejes X e Y con numeración
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
     .attr('class', 'x-axis')
     .attr('transform', `translate(0, ${innerHeight})`)
     .call(xAxis);

    g.append('g')
     .attr('class', 'y-axis')
     .call(yAxis);

    // Ejemplo de dibujar círculos para los centroides
    g.selectAll('circle.centroid')
      .data(this.centroids || [])
      .enter()
      .append('circle')
      .attr('class', 'centroid')
      .attr('cx', (d) => xScale(d[1])) // Mostrar el Centroide X en el eje X
      .attr('cy', (d) => yScale(d[2])) // Mostrar el Centroide Y en el eje Y
      .attr('r', 7) // Tamaño del círculo que representa el centroide
      .style('fill', 'green');

    // Dibujar puntos asignados a clústeres
    g.selectAll('circle.cluster-point')
      .data(this.clusters || [])
      .enter()
      .append('circle')
      .attr('class', 'cluster-point')
      .attr('cx', (d) => xScale(d.x)) // Mostrar el Punto X en el eje X
      .attr('cy', (d) => yScale(d.y)) // Mostrar el Punto Y en el eje Y
      .attr('r', 5) // Tamaño del círculo que representa los puntos del clúster
      .style('fill','blue');
  }
  // Función para exportar a PDF
  exportarPDF() {
    if (!this.centroids) return; // Verificar si this.centroids es undefined

  const columns = ['Cluster', 'Centroide X', 'Centroide Y'];
  const rows: string[][] = [
    columns,
    ...this.centroids.map((centroid, index) => [`Cluster ${index + 1}`, centroid[0].toString(), centroid[1].toString()]),
  ];

    const tableBody = rows.map((row) => row.map((cell) => ({ text: cell })));

    const docDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        { text: 'Resultados del Algoritmo KMeans', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: Array(columns.length).fill('*'),
            body: tableBody,
          },
          // Aplicar el estilo de la cabecera de la tabla (headerRows)
          layout: {
            fillColor: function (rowIndex: number, node: any, columnIndex: any) {
              // Fila de cabecera (preguntas)
              if (rowIndex === 0) {
                return '#E3BFFE'; // Color de fondo para la cabecera
              }
              // Resto de filas (respuestas)
              return null;
            },
          },
          style: 'table', // Estilo para las respuestas en el cuerpo (body)
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#0000',
          margin: [0, 10, 0, 10], // Ajusta los márgenes superior e inferior según lo necesites
        },
        table: {
          fontSize: 12, // Ajustar el tamaño del texto de la tabla
          color: 'black',
        },
      },
    };

    pdfMake.createPdf(docDefinition).open(); // Abrir el PDF en una nueva ventana del navegador
  }
}

export class Cluster {
  x: number;
  y: number;
  cluster: any;


  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;

  }


}
