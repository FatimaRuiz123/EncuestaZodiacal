import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.component.html',
  styleUrls: ['./entrenamiento.component.scss']
})
export class EntrenamientoComponent implements OnInit {
  centroids: number[][] | undefined;
  clusters: Cluster[] | undefined;
  @ViewChild('graficaD3', { static: true }) graficaD3!: ElementRef<SVGSVGElement>;

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
    this.mostrarGrafico();
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
      .attr('cx', (d) => xScale(d[0])) // Mostrar el Centroide X en el eje X
      .attr('cy', (d) => yScale(d[1])) // Mostrar el Centroide Y en el eje Y
      .attr('r', 7) // Tamaño del círculo que representa el centroide
      .style('fill', 'black');

    // Ejemplo de dibujar puntos asignados a clústeres
    this.clusters?.forEach((cluster, index) => {
      cluster.points.forEach((point) => {
        g.append('circle')
          .attr('class', 'cluster-point')
          .attr('cx', xScale(point[0])) // Mostrar el Punto X en el eje X
          .attr('cy', yScale(point[1])) // Mostrar el Punto Y en el eje Y
          .attr('r', 5) // Tamaño del círculo que representa los puntos del clúster
          .style('fill', `color del cluster ${index}`); // Puedes asignar un color único para cada clúster
      });
    });
  }

}

export class Cluster {
  centroid: number[];
  points: number[][]; // Agregar la propiedad points para almacenar los puntos del clúster

  constructor(centroid: number[], points: number[][]) {
    this.centroid = centroid;
    this.points = points;
  }
}
