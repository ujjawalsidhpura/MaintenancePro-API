const express = require('express');
const router = express.Router();
const mongoDb = require('../mongoDb')
const db = mongoDb.getDb();
const assets = 'assets' // Collection name in MongoDb

/* GET All Assets */
router.get('/', function (req, res) {

  db.collection(assets)
    .find().toArray((err, results) => {
      if (err) return console.log(err)

      res.send(results)
    });

});

//POST new Assets Item
router.post('/', (req, res) => {
  const data = req.body;

  db.collection(assets)
    .insertOne(data, (err, result) => {
      if (err) return console.log(err)

      res.send('Saved')
    })
});

module.exports = router;


