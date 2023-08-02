 import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cluster } from 'cluster';
// import { ActivatedRoute } from '@angular/router';
// import { Chart } from 'chart.js'; // Corregir la ruta de importación eliminando /dist
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
}
