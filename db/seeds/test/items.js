exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('items').insert({id: 6, name: 'shoes', packed: false}),
        knex('items').insert({id: 7, name: 'helmet', packed: true }),
        knex('items').insert({id: 8, name: 'chocolate', packed: false})
      ]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};