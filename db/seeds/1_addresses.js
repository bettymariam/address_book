exports.seed = function(knex, Promise) {
  return knex('addresses').del()
    .then(function () {
      return knex('addresses').insert([
        {id: 1, line_1: '5', line_2: 'Longbourne Estate', city : 'Herfordshire', zip : '87888'},
        {id: 2,line_1: '1', line_2: 'Pemberly', city : 'Derbishire', zip : '76767'},
        {id: 3,line_1: '23', line_2: 'Netherfield Park', city : 'Hertfordshire', zip : '78888'}
      ]);
    }).then(() => {
       return knex.raw(
         "SELECT setval('addresses_id_seq', (SELECT MAX(id) FROM addresses));"
       )
    })
};
