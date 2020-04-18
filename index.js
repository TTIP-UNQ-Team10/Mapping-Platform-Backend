const express = require('express');
const hospitals = require('./utils/hospitals.json');

var app = express();

// Routes
app.get('/', function(req, res){
  return res.send('Recibió un método GET');
});

app.get('/api/hospitals', function(req, res){
  console.log('Pediendo hospitales: ')
  return res.send(hospitals.features)
});

app.post('/', (req, res) => {
  return res.send('Recibió un método POST');
});

app.put('/', (req, res) => {
  return res.send('Recibió un método PUT');
});

app.delete('/', (req, res) => {
  return res.send('Recibió un método DELETE');
});


app.listen(8000);
console.log('Escuchando en el puerto 8000');
