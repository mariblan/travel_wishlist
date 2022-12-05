const express = require('express');
const app = express();
const countriesRouter = require('./routes/countriesRoutes');

// To enable our environment variables, we need to import dotenv and run the config() method BEFORE
// any other file or code that needs environment variables requires them.
require('dotenv').config();

// We import our connectToDB function from our dbConnection.js file
const connectToDB = require('./DB/dbConnection.js');
// // And we immediately run it, to have our database connection up as soon as the process/server starts.
// // While connectToDB is an async function, the time for it to conclude is quick enough to not have to wait for it to establish.
connectToDB();

const port = process.env.PORT || 4000;

// Since mongoose does not provide a sanitization tool out of the box, we can
// make use of the express-mongo-sanitize package to sanitize our data, by
// removing any dollar signs ($) from the request body, query or params.
// Documentation for it: https://www.npmjs.com/package/express-mongo-sanitize
// It serves as a middleware, so we can apply it to our whole app!
// Require it first:
const sanitize = require('express-mongo-sanitize');
// Then apply it to our app (you can also pass arguments to tailor your sanitization further)
app.use(sanitize({ allowDots: true, replaceWith: "_" }))

//This has to be use before establishing the routes, to transform the info into json
app.use(express.json())

// We have our app respond only to the '/countries' route, so all previous routes and relevant files/code were erased.
// In the authors, we will perform all CRUD operations, connect to our MongoDB database and with the help of our ODM
// Mongoose, create schemas and perform queries.
app.use('/countries', countriesRouter);

app.listen(port, () => console.log('Server started on port ' + port));