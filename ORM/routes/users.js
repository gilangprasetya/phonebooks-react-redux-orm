var express = require('express');
var router = express.Router();
var models = require('../models')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const users = await models.User.findAll()
    res.json(users)
  } catch (e) {
    res.json({ e })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const user = await models.User.create({
      name: req.body.name,
      phone: req.body.phone
    })
    res.json(user)
  } catch (e) {
    res.json({ e })
  }
});

module.exports = router;
