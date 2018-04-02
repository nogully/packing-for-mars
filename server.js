const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000); 

app.use(express.static('public'));

app.locals.title = 'Packing for Mars';

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then(items => {
      response.status(200).json(items);
    })
    .catch((error) => { 
      response.status(500).json({ error });
    });
});

app.post('/api/v1/items', (request, response) => {
  const { name } = request.body;
  if (!name) {
    return response.status(422).send({error: 'Please use a "name" parameter in your request'})
  }
  database('items').insert(name, 'id')
    .then(item => {
      response.status(201).json({ created: item[0]})
    })
    .catch((error) => {
      response.status(500).json({ error })
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});