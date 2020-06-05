// Load environment variables into `process.env`
require('dotenv').config({
  path: '../'
})

// Require packages
const MongoClient = require('mongodb').MongoClient
const { DB_USER, DB_PASSWORD, DB_URL, DB_NAME } = process.env

// Construct URI based on `.env`
const URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`


// Create a new MongoClient instance
const client = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Use connect method to connect to the Server
client.connect(async (error) => {

  // If an error occurs, throw it and end the function
  if (error) { throw error }

  console.log('Connected successfully to server')

  const database = client.db(DB_NAME)

  async function read({
    collection,
    query
  }) {
    const documents = await database
      .collection(collection)
      .find(query)
      .toArray()

    return documents
  }
  const users = await read({
    collection: 'users',
    query: { age: { $lt: 23 } }
  })
    .then(data => data)
    .catch(error => console.error)

  console.log(users)


  module.exports = { read }
})