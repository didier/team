// Load environment variables into `process.env`
require('dotenv').config()

// Require packages
const MongoClient = require('mongodb').MongoClient

const { DB_USER, DB_PASSWORD, DB_URL, DB_NAME } = process.env

// Construct URI based on `.env`
const URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`


const connect = async () => MongoClient
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => { throw err })

/**
 * @returns A promise that resolves with the data
 */
async function Read({ collection = '', query = {}, amount = 0 }) {
  // Connect to the database
  const client = await connect()

  try {
    // Fetch the response
    const response = await client.db(DB_NAME)
      .collection(collection)
      .find(query)
      .limit(amount)
      .toArray()

    // Return the response
    return response
  } catch (err) {

    // Catch and throw an error if it occurs
    throw err
  } finally {

    // Close connection to the client
    client.close()
  }
}

async function Create({ collection = '', data = {} }) {
  // Connect to the database
  const client = await connect()

  try {
    // Fetch the response
    if (Array.isArray(data) === true) {
      await client.db(DB_NAME)
        .collection(collection)
        .insertMany(data)
    } else {
      await client.db(DB_NAME)
        .collection(collection)
        .insertOne(data)
    }

    // Return the response
    return
  } catch (err) {

    // Catch and throw an error if it occurs
    throw err
  } finally {

    // Close connection to the client
    client.close()
  }
}

async function Update({ collection = '', query = {}, data = {} }) {

  // Check if data is not empty
  if (!data || data === {}) {
    throw new Error(`Can't update data with empty data. If you want to remove data, use the delete function.`)
  }

  // Connect to the database
  const client = await connect()

  try {

    // Check if data is an arroy or an object
    if (Array.isArray(data) === true) {
      await client.db(DB_NAME)
        .collection(collection)
        .updateMany(query, {
          $set: data
        })
    } else {
      await client.db(DB_NAME)
        .collection(collection)
        .updateOne(query, {
          $set: data
        })
    }

    console.log(`Set data to ${data}`)

    // Return the response
    return
  } catch (err) {

    // Catch and throw an error if it occurs
    throw err

  } finally {

    // Close connection to the client
    client.close()

  }
}

async function Delete({ collection = '', query = {}, data = {} }) {
  // Connect to the database
  const client = await connect()

  try {

    // Check if data is an arroy or an object
    if (Array.isArray(data) === true) {
      await client.db(DB_NAME)
        .collection(collection)
        // .find(query)
        .deleteMany(query, data)
    } else {
      await client.db(DB_NAME)
        .collection(collection)
        // .find(query)
        .deleteOne(query, data)
    }

    // Return the response
    return
  } catch (err) {

    // Catch and throw an error if it occurs
    throw err

  } finally {

    // Close connection to the client
    client.close()

  }
}

module.exports = { Create, Read, Update, Delete }