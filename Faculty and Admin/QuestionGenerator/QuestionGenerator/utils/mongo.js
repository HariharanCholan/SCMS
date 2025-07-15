const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://HARIHARAN:Hari0519@scms.wnt7tx1.mongodb.net/document_db?retryWrites=true&w=majority&appName=SCMS';

let client;

async function getMongoClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

module.exports = { getMongoClient };
