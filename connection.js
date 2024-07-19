const mongooes = require('mongoose');

const dbConnection = mongooes.connect('mongodb://localhost:27017/dummyData').then(()=>{
    console.log('Connected!')
}) .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

module.exports = dbConnection