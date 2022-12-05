// For us to connect to our Mongo database through Mongoose, we need to use the .connect() method for it.
// For that we import mongoose
const mongoose = require('mongoose');

// Then we can wrap our .connect() method in a function and export it, so we can run it in our index.js file (the entrypoint of our server).
// We can also pass a callback that will run once the connection is established. 
const connectToDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, () => console.log('Connected to MongoDB'));
}

module.exports = connectToDB