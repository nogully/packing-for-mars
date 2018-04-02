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
    it('should return all of the packing list', () => {
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
      .send({             
        body: { name: 'oxygen'} 
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('created');
        response.body.created.should.equal('id');
      })
      .catch(error => {
        throw error;
      });
    });
  });

});