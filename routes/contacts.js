var express = require('express');
var router = express.Router();
var knex = require("../db")

router.get('/', function(req, res, next) {
  knex.from('contacts').innerJoin('addresses', 'contacts.address_id', 'addresses.id')
  .then( contacts => {
    console.log(contacts);
    res.render('index', contacts[0]);
  })
  .catch( error => {
    console.log(error);
  })
});

module.exports = router;
