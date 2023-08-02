 import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cluster } from 'cluster';
// import { ActivatedRoute } from '@angular/router';
// import { Chart } from 'chart.js'; // Corregir la ruta de importación eliminando /dist


@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.component.html',
  styleUrls: ['./entrenamiento.component.scss']
})
export class EntrenamientoComponent implements OnInit {
  centroids: number[][] | undefined;
  clusters: Cluster[] | undefined;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if (state) {
      this.centroids = JSON.parse(state['centroids']);
      this.clusters = JSON.parse(state['clusters']);
    }
  }

  ngOnInit(): void {
    // Aquí puedes usar los datos de centroids y clusters para mostrar el gráfico de KMeans en la pantalla
    console.log('Centroids:', this.centroids);
    console.log('Clusters:', this.clusters);
  }

  // Si deseas volver a la pantalla anterior, puedes usar esta función
  volverATabla() {
    this.router.navigate(['/tabla']);
  }
}
