exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('items').insert({id: 1, name: 'shoes', packed: false}),
        knex('items').insert({id: 2, name: 'helmet', packed: true }),
        knex('items').insert({id: 3, name: 'chocolate', packed: false})
      ]);
    }).then(() => console.log('Seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
};