var express = require('express');
var router = express.Router();
const controller = require('../bin/Controllers/Controller')
const faker = require('faker');

/* GET users listing. */
router.get('/get', async function(req, res, next) {
  let users = await controller.get({}, null, 'users')
  if(Object.keys(users).length < 1){
    await controller.add({username: 'Tangostari', password: '5f4dcc3b5aa765d61d8327deb882cf99', firstname: 'Barry', lastname: 'Tickle', bio: faker.lorem.words(30)}, 'users')
        .finally(users = await controller.get({}, null, 'users'))
  }
  res.send(users);
});






module.exports = router;
