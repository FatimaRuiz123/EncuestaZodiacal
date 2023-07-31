import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterPipe } from './filter.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { kmeans } from 'ml-kmeans';

interface Cluster {
  centroid: number[];
  points: number[][];
}

interface KMeansResult {
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

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent implements OnInit, OnDestroy {
  preguntas: Pregunta[] = [];
  respuestas: Respuesta[] = [];
  filtroNombre: string = '';

  private unsubscribe$ = new Subject<void>();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
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
    // Obtener los datos necesarios para el entrenamiento
    const dataMatrix: number[][] = []; // Aquí debes llenar la matriz con los datos adecuados

    const k = 3; // Número de clusters que deseas obtener

    // Implementar el algoritmo de k-means
    const { clusters, centroids } = this.kmeans(dataMatrix, k);

    // Hacer lo que desees con los resultados obtenidos
    console.log('Clusters:', clusters);
    console.log('Centroids:', centroids);
  }

  kmeans(data: number[][], k: number): KMeansResult {
    // Implementa aquí la lógica del algoritmo de k-means (o puedes usar la librería "ml-kmeans" si lo prefieres)
    // Puedes seguir algún tutorial o guía para implementar el algoritmo manualmente

    // Por ejemplo, aquí hay una implementación simple que devuelve resultados aleatorios
    const clusters: Cluster[] = [];
    const centroids: number[][] = [];

    for (let i = 0; i < k; i++) {
      const centroid = data[Math.floor(Math.random() * data.length)];
      centroids.push(centroid);
      clusters.push({ centroid, points: [] });
    }

    for (const point of data) {
      let minDistance = Number.POSITIVE_INFINITY;
      let clusterIndex = -1;

      for (let i = 0; i < centroids.length; i++) {
        const distance = this.euclideanDistance(point, centroids[i]);

        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = i;
        }
      }

      clusters[clusterIndex].points.push(point);
    }

    return { clusters, centroids };
  }

  euclideanDistance(a: number[], b: number[]): number {
    // Implementa aquí la función para calcular la distancia euclidiana entre dos puntos
    // Puedes encontrar la fórmula de la distancia euclidiana en línea
    // Por ejemplo, aquí hay una implementación simple para 2D:
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
  }

    exportar() {
    throw new Error('Method not implemented.');
    }

}
