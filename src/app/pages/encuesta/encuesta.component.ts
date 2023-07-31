import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';



export interface Pregunta {
  id: number;
  idString: string;
  texto: string;
  opciones: string[];
  respuesta?: string;
}

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss']
})
export class EncuestaComponent {
  preguntas: Pregunta[] = [];
  nombrePersona = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.obtenerPreguntas();
  }

  obtenerPreguntas() {
    this.http.get<Pregunta[]>('http://localhost:3000/preguntas')
      .subscribe(data => {
        this.preguntas = data;
        this.preguntas.forEach(pregunta => {
          pregunta.idString = pregunta.id.toString();
        });
      });
  }

  guardarRespuesta(pregunta: Pregunta, opcion: string) {
    pregunta.respuesta = opcion;
  }

  enviarRespuestas() {
    const preguntasConRespuestas = this.preguntas.filter(pregunta => pregunta.respuesta);

    if (preguntasConRespuestas.length > 0 && this.nombrePersona) {
      const respuestasAgrupadas: { nombre: string; encuesta: any[] } = {
        nombre: this.nombrePersona,
        encuesta: preguntasConRespuestas.map(pregunta => ({
          pregunta: pregunta.texto,
          idpregunta: pregunta.id,
          respuesta: pregunta.respuesta,
          idrespuesta: pregunta.opciones.findIndex(opcion => opcion === pregunta.respuesta) + 1
        }))
      };
      // Enviar las respuestas agrupadas al servidor
      this.http.post('http://localhost:3000/respuestas', respuestasAgrupadas)
        .subscribe(
          data => {
            console.log('Respuestas guardadas:', data);
            this.snackBar.open('Respuestas guardadas con éxito', 'Cerrar', { duration: 3000 });
            this.limpiarRespuestas();
          },
          error => {
            console.error('Error al guardar las respuestas:', error);
            this.snackBar.open('Hubo un error al guardar las respuestas', 'Cerrar', { duration: 3000 });
          }
        );
    } else {
      this.snackBar.open('Debes seleccionar al menos una respuesta y proporcionar tu nombre antes de enviar.', 'Cerrar', { duration: 3000 });
    }
  }

  probarAlgoritmo() {
    throw new Error('Method not implemented.');
    }

  limpiarRespuestas() {
    this.preguntas.forEach(pregunta => {
      pregunta.respuesta = undefined;
    });
    this.nombrePersona = '';
  }
}
