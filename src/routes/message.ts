const express = require('express');
const router = express.Router();
const mongoDb = require('../mongoDb')
const db = mongoDb.getDb();
const messages = "messages";

// GET All Messages 
router.get('/', function (req, res) {

  db.collection(messages)
    .find()
    .toArray((err, results) => {
      if (err) return console.log(err)

      res.send(results)
    });

});

router.post('/', (req, res) => {
  console.log('hello iam message post');
  const data = req.body;

  db.collection(messages)
    .insertOne(data, (err, result) => {
      if (err) return console.log(err)
      res.send('Saved')
    })
});

module.exports = router;
