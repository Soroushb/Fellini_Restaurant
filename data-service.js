

/*module.exports.getAll = function () {
    return mealData;
  }

module.exports.getOne = function(x){
    return mealData[x];
}

var users = [
  {FirstName: "Jacques", LastName: "Tati", emailAddress:"monOncle@yahoo.com", passwordInput: "playtime"}
]
*/
module.exports.validateUserForm = function(formData){
  var errors = {isValid: true, username: "", email: "", name: "", password: "", password2: ""};

  validateUserFormUsername(formData.username, errors);
  validateUserFormEmail(formData.email, errors);
  validatePassword(formData.password, errors);
  return errors;
}

module.exports.validateLogin = function(formData){
  var loginErrors = {isValid: true, username: "", email: "", name: "", password: "", password2: ""};

  validateLoginEmail(formData.email, loginErrors);
  validateLoginPassword(formData.password, loginErrors);
  return loginErrors;
}

function validateLoginEmail(input, errors){
  if(!input.trim()){
      errors.isValid = false;
      errors.email += "Email field is required. "
      return;
  }

  if(!input.includes("@myseneca.ca")){ // fake: suppuse only seneca email is view as valid
      errors.isValid = false;
      errors.email += "Only Seneca student email is allowed. "
      return;
  }
};

function validateLoginPassword(input, errors){
  if(!input.trim()){ // if the username in "null" or empty string
      errors.isValid = false;
      errors.username += "password is required. "
      return;
}};

function validateUserFormUsername(input, errors){
  if(!input.trim()){ // if the username in "null" or empty string
      errors.isValid = false;
      errors.username += "username is required. "
      return;
  }

  // some calculation here
  if(input.length<4){ // other invalid condition
      errors.isValid = false;
      errors.username += "At least 4 characters for username. "
      return;
  }
}

function validateUserFormEmail(input, errors){
  if(!input.trim()){
      errors.isValid = false;
      errors.email += "Email field is required. "
      return;
  }

  if(!input.includes("@myseneca.ca")){ // fake: suppuse only seneca email is view as valid
      errors.isValid = false;
      errors.email += "Only Seneca student email is allowed. "
      return;
  }
}


module.exports.register = (user) => {
users.push(user);
console.log("users: ", users);
}

module.exports.login = (user) => {
  if(true){
    return true;
  }else{
    return false;
  }
}

module.exports.validateNull = (name) => {
  if(!name){return false;}
  else{return true;}
}

function validatePassword(password, errors) {
  var regex = /^[a-zA-Z0-9]+$/
  if(!regex.test(password)){
   errors.isValid = false;
   errors.password += "password must include letters and numbers only. "
    return
  }
  
  if(password.length < 6 || password.length > 12){
    errors.isValid = false;
    errors.password += "password is required between 6 and 12 characters. "
    return}
}

module.exports.findEmailAddress = (email) => {
  let found = false;
  for(let i = 0; i < users.length; i++){
  if(email == users[i].email)
  found = true;
  }
  return found;
}

module.exports.findpassword = (password) => {
  let found = false;
  for(let i = 0; i < users.length; i++){
  if(password == users[i].password)
  found = true;
  }
  return found;
}
/*
const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: mpromise (mongoose's default promise library) is deprecated"

// Load the schemas
const companySchema = require('./data_models/company.js');
// const employeeSchema = require('./data_models/employee.js');

module.exports = function(mongoDBConnectionString){

    let Company; // defined on connection to the new db instance
    let Employee; // defined on connection to the new db instance


    return {
        connect: function(){
            return new Promise(function(resolve,reject){
                let db = mongoose.createConnection(mongoDBConnectionString, 
                    { 
                        useNewUrlParser: true, 
                        useUnifiedTopology: true, 
                        useCreateIndex: true 
                    });
                
                db.on('error', (err)=>{
                    reject(err);
                });
        
                db.once('open', ()=>{
                    Company = db.model("Company", companySchema); // the created database collection (table) name will be "companies"
                    // Company = db.model("web322_companies", companySchema);

                    // Employee = db.model("Employee", employeeSchema);

                    resolve();
                });
            });
        },
        getAllCompanies: function(){
            return new Promise(function(resolve,reject){

                Company.find()
                //.sort({}) //optional "sort" - https://docs.mongodb.com/manual/reference/operator/aggregation/sort/ 
                .exec()
                .then((data) => {
                    companies = data.map(value => value.toObject());
                    console.log("companies", companies);
                    resolve(companies);
                })
                .catch((err)=>{
                    reject(err);
                });
            })
        },    
        getCompanyById: function(companyId){
            return new Promise(function(resolve,reject){

                Company.find({_id: companyId})
                //.sort({}) //optional "sort" - https://docs.mongodb.com/manual/reference/operator/aggregation/sort/ 
                .limit(1)
                .exec()
                .then((company) => {
                    resolve(company.toObject());
                })
                .catch((err)=>{
                    reject(err);
                });
            })
        },
        updateCompanyById: function (companyId, companyData) {
            return new Promise(function (resolve, reject) {
                if (Object.keys(companyData).length > 0) { // if there is data to update
                    Company.update({ _id: companyId }, // replace the current company with data from companyData
                        {
                            $set: companyData
                        },
                        { multi: false })
                        .exec()
                        .then((data) => {
                            resolve(companyId);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    resolve();
                }
            });
        },
        addCompany: function (companyData) {
            return new Promise(function (resolve, reject) {
                
                // Create a newCompany from the companyData
                var newCompany = new Company(companyData);

                newCompany.save((err,addedCompany) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(addedCompany._id);
                    }
                });
            });
        } ,

        getAllEmployees: function(){
            return new Promise(function(resolve,reject){

                Employee.find()
                //.sort({}) //optional "sort" 
                .exec()
                .then((employees) => {
                    resolve(employees);
                })
                .catch((err)=>{
                    reject(err);
                });
            })
        },


        
    }

}*/