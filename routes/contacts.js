var express = require('express');
var router = express.Router();
var knex = require("../db")

router.get('/', function(req, res, next) {
  knex.from('contacts').innerJoin('addresses', 'contacts.address_id', 'addresses.id')
  .then( contacts => {
    res.render('index', {contacts});
  })
  .catch( error => {
    console.log(error);
  })
});

router.get('/new', function(req, res, next) {
  knex.from('addresses')
  .then(result => {
    result.forEach((el)=>{
      el.addressJson = JSON.stringify(el);
      el.addressString = el.line_1 + ' ' + el.line_2 + ' ' + el.city + '  ' + el.zip;
    })
    res.render('addressBook/newContact', {result});
  })
  .catch( error => {
    console.log(error);
  })
});

router.get('/:id', function(req, res, next) {
  knex.from('contacts').innerJoin('addresses', 'contacts.address_id', 'addresses.id')
  .where('contacts.id', req.params.id)
  .then( contact => {
    res.render(`addressBook/showContact`, contact[0]);
  })
  .catch( error => {
    console.log(error);
  })
});

router.post('/', (req,res,next) => {
  let address = {
    line_1: req.body.line_1,
    line_2: req.body.line_2,
    city: req.body.city,
    zip: req.body.zip
  }
  knex('addresses')
  .insert(address)
  .returning('id')
  .then(id  => {
    console.log(id);
    let contact = {
      address_id : id[0],
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      email_address: req.body.email_address,
      image_url: req.body.image_url
    }
    knex('contacts')
    .insert(contact)
    .returning('id')
    .then(id => {
      res.redirect(`/contacts/${id}`)
    })
  })
})

router.delete('/:id',(req,res,next) => {
    let id = req.params.id
    knex('contacts')
    .del()
    .where({id})
    .returning('address_id')
    .then(addressID => {
      knex('contacts')
      .count()
      .where('address_id', addressID[0])
      .then(count => {
        if (count[0] === 0) {
          knex('addresses')
          .del()
          .where('id', addressID[0])
          .then(() => {
            res.redirect('/contacts')
          })
        }
          res.redirect('/contacts')
      })
    })
  })

module.exports = router;
