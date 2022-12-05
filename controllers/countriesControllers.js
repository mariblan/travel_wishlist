// Since we will have no html/front end to test our API, we will rely on Postman or Insomnia to
// test our CRUD operations and see if our backend is responding as expected.

// Firstly we need to import our Countries collection from our models
const countriesCollection = require('../models/countryModel.js');

// Given our database queries can take a little to complete, we will use async/await to handle them
const getCountries = async (req, res) => {
    // With async/await, we use try/catch to handle errors
    try{
        // Then we can query our database! This function is meant to return all countries in the database
        const countries = await countriesCollection.find();
        console.log()
        return res.status(200).json(countries);
    } catch(error) {
       // If there is an error, we will send a 500 status code and the error's message to the client
       res.status(500).send(error.message)
    }
   
 }

const getCountryById = async (req, res) => {
    try {
        const {id} = req.params;   
        const countryById = await countriesCollection.findById(id);
        // We do a conditional check to see if the couuntry exists. If it does, we return the country. If it doesn't, we return a 404 status code and a message.
        if (countryById) return res.status(200).json(countryById);
        // Remember, if you send a response like so, make sure that it be the return of your function, otherwise, you will get an error "Cannot set headers after they are sent to the client"
        // Meaning: Your function sent a response but did not return, so it continues execution, and the next step is to send another response.
        res.status(404).send('Country not found');
      } catch (error) {
        res.status(500).send(error.message);
      }
}


const postCountry = async(req, res) => {
    try {
        const {name, alpha2Code, alpha3Code} = req.body;
        // We can do some validation whether our body is sending the expected data here. If not, we can send a 400 status code and a message to the client.
        if (!name || !alpha2Code || !alpha3Code) return res.status(400).send('Please provide all required fields');
    
        // Then additionally we can check if the author already exists in the database. If so, we can send a 400 status code and a message to the client.
        const findCountry = await countriesCollection.findOne({name});
        if (findCountry) return res.status(400).send('Country already exists');
    
        // And lastly, we can create a new author and save it to the database if everything is ok.
        const newCountry = await countriesCollection.create(req.body);
        res.status(201).json(newCountry);
      } catch (error) {
        res.status(500).send(error.message);
      }
}

const updateCountry = async(req, res) => {
    try {
        const {id} = req.params;
    
        // Since this PUT request is meant to update any of the Author's fields, we need to check 
        // if the Author exists first
        const findCountry = await countriesCollection.findById(id);
        // If the Author does not exist, we return a 404 status code
        if (!findCountry) return res.status(404).send('Country does not exist');
    
        // If the Author exists, we can now update the Author's fields
        // The findByIdAndUpdate method takes a few parameters, at the bare minimum:
        // Tbe id of the document to update, and the fields to update.
        // However, if you need the updated document to be returned, you need to add the
        // {new: true} parameter as a third argument so your query returns you the updated document
        const updateCountry = await countriesCollection.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(updateCountry);
      } catch (error) {
        res.status(500).send(error.message);
      }
}

const deleteCountry = async(req, res) => {
    try {
        const {id} = req.params;
        // Similarly as for the PUT request, we need to check if the author exists first
        const findCountry = await countriesCollection.findById(id);
        if (!findCountry) return res.status(400).send('Country does not exist');
    
        // It is not advised to completely erase an info from your database, as it can lead to
        // gaps in information (and somethimes you might need to reference an this info that "deleted"
        // was deleted. Instead, we can set a flag to indicate that the user is no longer active
        // by swapping the active: false field to the user's document)
        // const deactivateCountry = await countriesCollection.findByIdAndUpdate(id, {active: false}, {new: true});
        // res.status(200).json(deactivateCountry);
    
        // Alternatively, if you REALLY need to delete a document, you can use the following code 
        // (Comment out lines 73 and 74, and uncomment the two lines below)):
        const deleteCountry = await countriesCollection.findByIdAndDelete(id);
        res.status(200).json(deleteCountry);
      } catch (error) {
        res.status(500).send(error.message);
      }
}

const getCountryByCode = async (req, res) => {
  // We do a conditional check to see if the country exists. If it does, we return the country. If it doesn't, we return a 404 status code and a message.
  // if (countryByCode3)  return res.status(200).json(countryByCode3);
  // if (countryByCode2 === code) return res.status(200).json(countryByCode2);
  // if (!countryByCode3 && !countryByCode2) return res.status(400).send('Country does not exist');
  // Remember, if you send a response like so, make sure that it be the return of your function, otherwise, you will get an error "Cannot set headers after they are sent to the client"
  // Meaning: Your function sent a response but did not return, so it continues execution, and the next step is to send another response.
  try {
      const {code} = req.params; 
      console.log(code)
      if(code.length === 2){
        const countryByCode2 = await countriesCollection.find({alpha2Code: code});
        if (countryByCode2) return res.status(200).json(countryByCode2);
      } else if (code.length === 3) {
        const countryByCode3 = await countriesCollection.find({alpha3Code: code});
        if (countryByCode3) return res.status(200).json(countryByCode3);
      } else if (code.length <= 3) {
        const countryByCode2 = await countriesCollection.find({alpha2Code: code});
        const countryByCode3 = await countriesCollection.find({alpha3Code: code});
        if(!countryByCode2 && !countryByCode3) return res.status(400).send('Country does not exist');
      } 

      res.status(404).send('Country not found');
    } catch (error) {
      res.status(500).send(error.message);
    }
}

const updateCountryByCode = async(req, res) => {
  // Since this PUT request is meant to update any of the Author's fields, we need to check 
  // if the Author exists first    
  // If the Author does not exist, we return a 404 status code
  // If the Author exists, we can update the Author's fields
  // The findOneAndUpdate method takes a few parameters, at the bare minimum:
  // The code (needs to be an object) of the document to update, and the fields to update.
  // However, if you need the updated document to be returned, you need to add the
  // {new: true} parameter as a third argument so your query returns you the updated document
  try {
    const {code} = req.params; 
    console.log(code)


    if(code.length === 2){
      const updateCountry = await countriesCollection.findOneAndUpdate({alpha2Code: code}, req.body, {new: true});
      res.status(200).json(updateCountry);
    } else if (code.length === 3) {
      const updateCountry = await countriesCollection.findOneAndUpdate({alpha3Code: code}, req.body, {new: true});
      res.status(200).json(updateCountry);
    } else if (code.length <= 3) {
      
      const findCountry2 = await countriesCollection.find({alpha2Code: code});
      const findCountry3 = await countriesCollection.find({alpha3Code: code});
      if (!findCountry2 && !findCountry3) return res.status(404).send('Country does not exist');
    } 
     
      


    } catch (error) {
      res.status(500).send(error.message);
    }
}

const deleteCountryByCode = async(req, res) => {
   // Similarly as for the PUT request, we need to check if the author exists first
  
      // It is not advised to completely erase an user from your database, as it can lead to
      // gaps in information (and somethimes you might need to reference an user that "deleted"
      // their account. Instead, we can set a flag to indicate that the user is no longer active
      // by swapping the active: false field to the user's document)
      // const deactivateCountry = await countriesCollection.findByIdAndUpdate(id, {active: false}, {new: true});
      // res.status(200).json(deactivateCountry);
  
      // Alternatively, if you REALLY need to delete a document, you can use the following code 
      // (Comment out lines 73 and 74, and uncomment the two lines below)):
  try {
    const {code} = req.params; 
    console.log(code)
    if(code.length === 2){
      const deleteCountry = await countriesCollection.findOneAndDelete({alpha2Code:code});
      res.status(200).json(deleteCountry);
    } else if (code.length === 3) {
      const deleteCountry = await countriesCollection.findOneAndDelete({alpha3Code:code});
      res.status(200).json(deleteCountry);
    } else if (code.length <= 3) {
      const findCountry2 = await countriesCollection.find({alpha2Code: code});
      const findCountry3 = await countriesCollection.find({alpha3Code: code});
      if (!findCountry2 && !findCountry3) return res.status(404).send('Country does not exist');
    } 

    } catch (error) {
      res.status(500).send(error.message);
    }
}

module.exports = {getCountries, getCountryById, postCountry, updateCountry, deleteCountry, getCountryByCode, updateCountryByCode, deleteCountryByCode}