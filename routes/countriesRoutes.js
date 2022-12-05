
const express = require('express');
const countriesRouter = express.Router();

const {getCountries, getCountryById, postCountry, updateCountry, deleteCountry,getCountryByCode, updateCountryByCode, deleteCountryByCode} = require('../controllers/countriesControllers.js');

// Our author route remais unchanged. We will now have our routes actually do something with our database,
// so refer to the controllers for the actual changes!
countriesRouter.route('/').get(getCountries).post(postCountry);
countriesRouter.route('/:code').get(getCountryByCode).put(updateCountryByCode).delete(deleteCountryByCode);
countriesRouter.route('/:id').get(getCountryById).put(updateCountry).delete(deleteCountry);


module.exports = countriesRouter;