const express = require('express');
const { ObjectId } = require('bson');
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

//Edit Asset
router.post('/edit', function (req, res) {
  const asset_id = req.body._id

  db.collection(assets)
    .updateOne(
      { _id: ObjectId(asset_id) },
      {
        $set: {
          name: req.body.name,
          brand: req.body.brand,
          model: req.body.model,
          serial: req.body.serial,
          last_serviced_on: req.body.last_serviced_on,
          next_service_on: req.body.next_service_on,
          anticipated_life: req.body.anticipated_life,
          installed_on: req.body.installed_on
        }
      },
      function (err, result) {
        if (err) throw err
        res.send('Updated')
      }
    )
});

//Delete Asset
router.post('/delete', function (req, res) {
  const asset_id = req.body.asset_id

  db.collection(assets)
    .deleteOne(
      { _id: ObjectId(asset_id) },

      function (err, result) {
        if (err) throw err
        res.send('deleted')
      }
    )
});

module.exports = router;


