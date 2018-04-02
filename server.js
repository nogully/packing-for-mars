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
      return response.status(200).json(items);
    })
    .catch((error) => { 
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/items', (request, response) => {
  const item = request.body;
  if (!item.name) {
    return response.status(422).send({error: 'Please use a "name" parameter in your request'})
  }
  database('items').insert(item, 'id')
    .then(items => {
      response.status(201).json({ name: item.name, id: items[0] })
    })
    .catch((error) => {
      response.status(500).json({ error })
    });
});


app.delete('/api/v1/items/:id', (request, response) => {
  database('items').where('id', request.params.id).del()
    .then(id => {
      if (id) {
        response.status(202).json({ id })
      } else {
        response.status(404).json({
          error: `Could not find item with id ${request.params.id}`
        })
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    })
})

app.patch('/api/v1/items/:id', (request, response) => {
  let packedStatus;
  if (request.body.packed === true) {
    packedStatus = 't';
  } else {
    packedStatus = 'f';
  }
  database('items').where('id', request.params.id).select()
    .then(result => {
      if (result.length) {
        database('items').where('id', id).update({ packed: packedStatus })
          .then(() => response.status(200).json(`Updated packed status on ${id}`));
      } else {
        return response.status(404).send({ error: 'That item does not exist' });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
