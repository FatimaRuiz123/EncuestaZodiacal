 import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Chart } from 'chart.js'; // Corregir la ruta de importación eliminando /dist


@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.component.html',
  styleUrls: ['./entrenamiento.component.scss']
})
export class EntrenamientoComponent implements OnInit {
//   centroids: number[][] | any;
//   clusters: number[] | any;

//   constructor(private route: ActivatedRoute) { }

 ngOnInit(): void {
//     // Obtener los resultados del entrenamiento del estado de la ruta
//     this.route.paramMap.subscribe(params => {
//       const state = window.history.state;
//       if (state && state.centroids && state.clusters) {
//         this.centroids = state.centroids;
//         this.clusters = state.clusters;
//         // Llamar a la función para crear la gráfica
//         this.createChart();
//       }
//     });
  }

//   createChart() {
//     // Implementar la lógica para crear la gráfica con Chart.js
//     // Aquí tienes un ejemplo básico de cómo crear una gráfica de líneas con los centroides
//     const canvas: any = document.getElementById('myChart');
//     const ctx = canvas.getContext('2d');

//     const data = {
//       labels: this.centroids.map((_: any, index: number) => `Cluster ${index + 1}`),
//       datasets: [{
//         label: 'Centroides',
//         data: this.centroids.map((centroid: any[]) => centroid[1]), // Coordenada Y de los centroides
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 2,
//         fill: false
//       }]
//     };

//     const options = {
//       scales: {
//         yAxes: [{
//           ticks: {
//             beginAtZero: true
//           }
//         }]
//       }
//     };

//     const myChart = new Chart(ctx, {
//       type: 'line',
//       data: data,
//       options: options
//     });
//   }
}
