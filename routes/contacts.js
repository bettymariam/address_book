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

router.post('/', (req,res,next) => {
  let address = {
    line_1: req.body.line_1,
    line_2: req.body.line_2,
    city: req.body.city,
    zip: req.body.zip
  }
  db('addresses')
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
      poster_url: req.body.poster_url
    }
    db('contacts')
    .insert(contact)
    .returning('id')
    .then(id => {
      res.redirect(`/contacts/${id}`)
    })
  })
})

module.exports = router;
