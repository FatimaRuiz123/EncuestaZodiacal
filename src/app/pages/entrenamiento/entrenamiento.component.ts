 import { Component, OnInit } from '@angular/core';
 import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.component.html',
  styleUrls: ['./entrenamiento.component.scss']
})
export class EntrenamientoComponent implements OnInit {
  centroids: number[][] = [];
  clusters: number[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener los datos de centroids y clusters desde la URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      const centroidsData = params.get('centroids');
      const clustersData = params.get('clusters');

      if (centroidsData && clustersData) {
        this.centroids = JSON.parse(centroidsData);
        this.clusters = JSON.parse(clustersData);

        // Pintar la gráfica después de recibir los datos
        this.pintarGrafica();
      }
    });
  }
  pintarGrafica(): void {
    // Lógica para pintar la gráfica utilizando los datos de centroids y clusters
    // Por ejemplo, puedes dibujar los puntos de cada cluster en el canvas
    const canvas = document.getElementById('graficaCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const colors = ['red', 'blue', 'green', 'orange', 'purple']; // Array de colores para los clusters

      for (let i = 0; i < this.centroids.length; i++) {
        ctx.fillStyle = colors[i % colors.length];
        const centroid = this.centroids[i];

        for (let j = 0; j < this.clusters.length; j++) {
          if (this.clusters[j] === i) {
            const x = centroid[0];
            const y = centroid[1];
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    } else {
      console.error('Error: El contexto del canvas es nulo.');
    }
  }
}
