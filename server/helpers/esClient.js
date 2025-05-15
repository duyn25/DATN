const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: '+Joh*TBL_A5vN7xnm7CD'
  },
  tls: {
    rejectUnauthorized: false 
  }
});

module.exports = client;
