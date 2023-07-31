const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/encuesta_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) =>
    console.error('Error en la conexión a MongoDB:', error)
  );

// Definir esquema para las respuestas de la encuesta
const respuestaSchema = new mongoose.Schema({
  nombre: String,
  encuesta: [
    {
      pregunta: String,
      idpregunta: Number,
      respuesta: String,
      idrespuesta: Number,
    },
  ],
});

const Respuesta = mongoose.model('Respuesta', respuestaSchema);

// Rutas para obtener preguntas y guardar respuestas
app.get('/preguntas', (req, res) => {
  const preguntas = [
    { id: 1, texto: '1.¿Cuál es tu fecha de nacimiento?', opciones: ['Enero - Marzo', 'Abril - Junio', 'Julio - Septiembre', 'Octubre - Diciembre'] },
      {id:2,texto: '2.¿En qué estación del año naciste?', opciones: ['Primavera','Verano','Otoño','Invierno']},
      {id:3,texto: '3.¿Te consideras una persona apasionada y enérgica?', opciones: [' Sí, definitivamente','Algunas veces','No mucho','No soy apasionado/a']},
      {id:4,texto: '4.¿Prefieres llevar una vida activa y aventurera o más tranquila y estable?', opciones: ['Activa y aventurera','Tranquila y estable','Depende del momento','No estoy seguro/a']},
      {id:5,texto: '5.¿Eres alguien muy independiente o te gusta estar rodeado de amigos y familiares?', opciones: ['Muy independiente','Me gusta estar rodeado/a de amigos y familiares','Un equilibrio entre ambos','No lo sé bien']},
      {id:6,texto: '6.¿Tienes una personalidad creativa y artística?', opciones: ['Sí, definitivamente','Un poco','No mucho','No soy creativo/a']},
      {id:7,texto: '7.¿Te resulta fácil tomar decisiones o tiendes a ser más reflexivo?', opciones: ['Tomo decisiones fácilmente','Tiendo a reflexionar antes de decidir','Depende del tipo de decisión','No lo sé']},
      {id:8,texto: '8.¿Qué importancia le das a la lógica y el pensamiento racional?', opciones: ['Muy importante',' Algo importante','No es una prioridad para mí','No sé qué pensar']},
      {id:9,texto: '9.¿Eres una persona comunicativa y sociable?', opciones: ['Muy comunicativo/a y sociable','Soy sociable, pero no muy comunicativo/a','Prefiero ser reservado/a','No estoy seguro/a']},
      {id:10,texto: '10.¿Sientes una conexión especial con el elemento tierra, agua, aire o fuego?', opciones: ['Tierra','Agua','Aire','Fuego']},
      {id:11,texto: '11.¿Te preocupa el bienestar de los demás y tiendes a ayudarlos en sus problemas?', opciones: ['Sí, siempre estoy preocupado/a por los demás','Ayudo cuando puedo, pero no siempre','Prefiero enfocarme en mis propios asuntos','No lo sé bien']},
      {id:12,texto: '12.¿Eres muy organizado/a y práctico/a en tu vida cotidiana?', opciones: ['Sí, soy muy organizado/a y práctico/a','Soy algo organizado/a y práctico/a','No mucho','No me considero así']},
      {id:13,texto: '13.¿Te atraen los retos y te esfuerzas por superar obstáculos?', opciones: ['Sí, me encantan los retos',' A veces, depende del desafío',' No me gustan mucho los retos','No lo sé']},
      {id:14,texto: '14.¿Eres una persona decidida y perseverante?', opciones: ['Sí, siempre soy decidido/a y perseverante','Soy decidido/a en algunas cosas, pero no siempre perseverante','No soy muy decidido/a ni perseverante','No estoy seguro/a']},
      {id:15,texto: '15.¿Cómo reaccionas ante el cambio y las nuevas situaciones?', opciones: ['Me emociono y me adapto fácilmente','Me siento algo incómodo/a, pero me adapto con el tiempo','Me resisto al cambio y prefiero lo conocido','No lo sé bien']},
    // Puedes agregar más preguntas aqui
  ];
  res.json(preguntas);
});

app.post('/respuestas', (req, res) => {
  const respuestasAgrupadas = req.body;

  // Guardar respuestas en la base de datos
  Respuesta.create(respuestasAgrupadas)
    .then((respuestasGuardadas) => {
      console.log('Respuestas guardadas:', respuestasGuardadas);
      res.json({ message: 'Respuestas guardadas con éxito' });
    })
    .catch((error) => {
      console.error('Error al guardar respuestas:', error);
      res
        .status(500)
        .json({ error: 'Hubo un error al guardar las respuestas' });
    });
});

app.get('/respuestas', (req, res) => {
  Respuesta.find({})
    .then((respuestas) => {
      res.json(respuestas);
    })
    .catch((error) => {
      console.error('Error al obtener las respuestas:', error);
      res
        .status(500)
        .json({ error: 'Hubo un error al obtener las respuestas' });
    });
});

app.listen(port, () =>
  console.log(`Servidor iniciado en http://localhost:${port}`)
);
