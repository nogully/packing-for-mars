const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(error => {
      throw error;
    });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/sad')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(error => {
      throw error;
    });
  });
});

describe('API Routes', () => {
  beforeEach( (done) => {
    database.migrate.rollback()
      .then( () => {
        database.migrate.latest()
      .then( () => {
        return database.seed.run()
        .then( () => {
          done();
        })
      })
    })
  });

  describe('GET /api/v1/items', () => {
    it('should return all items in the packing list', () => {
      return chai.request(server)
      .get('/api/v1/items')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('name');
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('POST /api/v1/items', () => {
    it('should create a new list item', () => {
      return chai.request(server)
      .post('/api/v1/items')
      .send({ name: 'oxygen' })
      .then(response => {
        response.should.have.status(201)
      })
      .catch(error => {
        throw error;
      })
    })

    it('should return status 422 if missing params in the body', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({ body: 'hello' })
        .then(response => {
          response.should.have.status(422)
          response.body.error.should.equal('Please use a "name" parameter in your request')
        })
        .catch( error => {
          throw error;
        })
    })
  });

  describe('PATCH /api/v1/items/:id', () => {
    it('should return a success message when the checkmark is changed', () => {
      return chai.request(server)
        .patch('/api/v1/items/6')
        .send({
          packed: true 
        })
        .then( response => {
          response.should.have.status(200);
          response.body.should.equal('Updated packed status on 6')
        })
        .catch( error => {
          throw error;
        })
    })
  });

  describe('DELETE /api/v1/items/:id', () => {
    it('should delete the expected item', () => {
      return chai.request(server)
      .delete('/api/v1/items/7')
      .then( response => {
        response.should.have.status(202);
      })
      .catch(error => {
        throw error;
      })
    })
  })
});