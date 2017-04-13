
exports.seed = function(knex, Promise) {
  return knex('contacts').del()
    .then(function () {
      return knex('contacts').insert([
        {address_id : 1, first_name : 'Elizabeth',last_name : 'Bennet',phone_number : '123-456-7896', email_address : 'liz@bookworm.com' , image_url : 'http://vignette1.wikia.nocookie.net/janeausten/images/7/78/Elizabeth-Bennet-elizabeth-bennet-31632202-283-424.jpg/revision/latest?cb=20131126183650'},
        {address_id : 2, first_name : 'Fitzwilliam',last_name : 'Darcy',phone_number : '456-123-9876', email_address : 'richdude@wealthy.com' , image_url : 'http://vignette1.wikia.nocookie.net/janeausten/images/2/2a/FD_CF_front.jpg/revision/latest?cb=20120228153927'},
        {address_id : 1, first_name : 'Jane', last_name : 'Bennet',phone_number : '656-767-7676', email_address : 'pretty_gal@desperate.com' , image_url : 'https://s-media-cache-ak0.pinimg.com/originals/a3/dd/48/a3dd4887038eced6e21312eff50be3ae.jpg'},
        {address_id : 3, first_name : 'Charles',last_name : 'Bingley',phone_number : '123-487-7677', email_address : 'happy_go_lucky@previledged.com' , image_url : 'https://68.media.tumblr.com/8b01b7635038ad9cc0e41755fe46aba1/tumblr_muyr742orK1r4grm0o1_500.gif'}
      ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('contacts_id_seq', (SELECT MAX(id) FROM contacts));"
      );
    });
};
