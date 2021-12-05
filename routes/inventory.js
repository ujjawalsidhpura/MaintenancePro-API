const express = require('express');
const { ObjectId } = require('bson');
const router = express.Router();
const mongoDb = require('../mongoDb')
const db = mongoDb.getDb();
const inventory = 'Inventory' // Collection name in MongoDb

/* GET All Inventory */
router.get('/', function (req, res) {

  db.collection(inventory)
    .find().toArray((err, results) => {
      if (err) return console.log(err)

      res.send(results)
    });

});

//POST new Inventory Item
router.post('/', (req, res) => {
  const data = req.body;

  db.collection(inventory)
    .insertOne(data, (err, result) => {
      if (err) return console.log(err)
      res.send('Saved')
    })
});

//Edit Inventory

router.post('/edit', function (req, res) {
  const inventory_id = req.body._id

  db.collection(inventory)
    .updateOne(
      { _id: ObjectId(inventory_id) },
      {
        $set: {
          category: req.body.category,
          item: req.body.item,
          price_item: req.body.price_item,
          quantity: req.body.quantity
        }
      },
      function (err, result) {
        if (err) throw err
        res.send('Updated')
      }
    )
});

//Filter Inventory by Category/Name/Both

router.post('/filter', function (req, res) {

  const item_name = req.body.item_name ? req.body.item_name : null;
  const category = req.body.category ? req.body.category : null;

  if (category && !item_name) {

    db.collection(inventory)
      .find({ _category: category })
      .toArray((err, results) => {
        if (err) return console.log(err)
        res.send(results)
      });

  } else if (!category && item_name) {

    db.collection(inventory)
      .find({
        item: {
          '$regex': item_name, '$options': 'i'
        }
      })
      .toArray((err, results) => {
        if (err) return console.log(err)

        res.send(results)
      });

  } else if (category && item_name) {

    db.collection(inventory)
      .find({
        '$and': [
          {
            item:
            {
              '$regex': item_name, '$options': 'i'
            }
          },
          {
            _category: category
          }
        ]
      })
      .toArray((err, results) => {
        if (err) return console.log(err)

        res.send(results)
      });

  }

});



module.exports = router;


