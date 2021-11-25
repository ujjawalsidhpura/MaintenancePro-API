function create(user, callback) {
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb').MongoClient;
  const CONNECTION_URL = process.env.CONNECTION_URL
  const client = new MongoClient(CONNECTION_URL);

  client.connect(function (err) {
    if (err) return callback(err);
    const db = client.db('MaintenancePro');
    const users = db.collection('Users');
    users.findOne({ email: user.email }, function (err, withSameMail) {
      if (err || withSameMail) {
        client.close();
        return callback(err || new Error('the user already exists'));
      }
      console.log("We are connected!");
      bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
          client.close();
          return callback(err);
        }
        user.password = hash;
        users.insert(user, function (err, inserted) {
          client.close();
          if (err) return callback(err);
          callback(null);
        });
      });
    });
  });
}
let user = {
  email: 'zsh@gmail.com',
  password: '123',
  role: 'admin'
};
create(user, function (result) {
  console.log("we are good");
});