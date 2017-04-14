var express = require('express');
var router = express.Router();
var knex = require("../db")

router.get('/', function(req, res, next) {
  knex.from('contacts').innerJoin('addresses', 'contacts.address_id', 'addresses.id')
  .select('*', 'contacts.id as contact_id','addresses.id as addressID')
  .then( contacts => {
    console.log(contacts);
    res.render('index', {contacts:contacts});
  })
  .catch( error => {
    console.log(error);
  })
});

router.get('/new', function(req, res, next) {
  knex.from('addresses')
  .then(contact => {
    contact.forEach((el)=>{
      el.addressJson = JSON.stringify(el);
      el.addressString = el.line_1 + ' ' + el.line_2 + ' ' + el.city + '  ' + el.zip;
    })
    res.render('addressBook/newContact', {title: 'New Contact', contact:contact});
  })
  .catch( error => {
    console.log(error);
  })
});


router.get('/:id', function(req, res, next) {
  knex.from('contacts').innerJoin('addresses', 'contacts.address_id', 'addresses.id')
  .select('*', 'contacts.id as contact_id','addresses.id as addressID')
  .where('contacts.id', req.params.id)
  .first()
  .then( contact => {
    res.render(`addressBook/showContact`, contact);
  })
  .catch( error => {
    console.log(error);
  })
});

router.get('/edit/:id', function(req, res, next) {
  knex.from('contacts').innerJoin('addresses', 'contacts.address_id', 'addresses.id')
  .select('*', 'contacts.id as contact_id','addresses.id as addressID')
  .where('contacts.id', req.params.id)
  .first()
  .then( contact => {
    console.log(contact);
    res.render(`addressBook/edit`, {title: 'Edit Contact', contact});
  })
  .catch( error => {
    console.log(error);
  })
});

router.put('/:id', (req,res,next) => {
  let address = {
    line_1: req.body.line_1,
    line_2: req.body.line_2,
    city: req.body.city,
    zip: req.body.zip
  }
  let contact = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone_number: req.body.phone_number,
    email_address: req.body.email_address,
    image_url: req.body.image_url
  }
  var contact_id =req.params.id;
  knex('contacts')
  .update(contact)
  .where('id', contact_id)
  .returning('address_id')
  .then(id  => {
    knex('addresses')
    .update(address)
    .where('id', id[0])
    .then(() => {
      res.redirect(`/contacts/${contact_id}`)
    })
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
  .where('line_1', address.line_1)
  .andWhere('line_2', address.line_2)
  .andWhere('city', address.city)
  .andWhere('zip', address.zip)
  .first()
  .then(addressDetails => {
    if (addressDetails) {
      return addressDetails;
    } else {
     return knex('addresses')
            .insert(address)
            .returning('id')
            .first()
    }
  })
  .then(addressDetails  => {
    let contact = {
      address_id : addressDetails.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      email_address: req.body.email_address,
      image_url: req.body.image_url
    }
    return knex('contacts')
    .insert(contact)
    .returning('id')
  })
  .then(id => {
    res.redirect(`/contacts/${id}`)
  })
});

router.delete('/:id',(req,res,next) => {
    let id = req.params.id
    knex('contacts')
    .where({id})
    .del()
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
  });

module.exports = router;
