/**********************************************************************************
 *   WEB322 –Assignment 03-05*  I declare that this assignment is my own work in 
 * accordance with Seneca  Academic Policy.  No part *  of this assignment has
 *  been copied manually or electronically from any other source *  (including 3rd party web sites)
 *  or distributed to other students.* *  Name: _______Soroush Bahrami_________ Student ID: ___152499182___ 
 * Date: ____25/11/2020___**  Online (Heroku, https://...) Link: ___________________________________________________
 * *********************************************************************************/ 
var express = require("express");
const path = require("path");
var app = express();
let dataService = require('./data-service');
var nodemailer = require('nodemailer');
const exphbs = require('express-handlebars');
const multer = require("multer");
const clientSessions = require("client-sessions");
const _ = require ("underscore");
const fs = require("fs");
const mongoose = require("mongoose");
var Schema = mongoose.Schema;


const mealModel = require("./data_models/mealModel");
const userModel = require("./data_models/userModel");
const PHOTODIRECTORY = "./public/photos";

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');


require('dotenv').config();
const connectionString = process.env.MONGODB_CONN_STR;

//const data_service = require("./data-service.js");
//const dataServiceConnect = data_service(connectionString);

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


// make sure the photos folder exists
// if not create it

if (!fs.existsSync(PHOTODIRECTORY)) {
  fs.mkdirSync(PHOTODIRECTORY);
}


mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});

var HTTP_PORT = process.env.PORT || 8080;


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// call this function after the http server starts listening for requests



// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
  destination: PHOTODIRECTORY,
  filename: (req, file, cb) => {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

mongoose.connection.on("open", () => {
  console.log("Database connection open.");
});



app.get("/", function(req,res){

  mealModel.find().lean()
  .exec()
  .then((photos) => {
    // underscore ( _ ) is a common library full of utility methods you can use
    // to make certain tasks a lot easier on yourself. Here we use underscore to
    // loop through the photos and and for each photo, set the uploadDate to a 
    // more user friendly date format. http://underscorejs.org/#each
    _.each(photos, (photo) => {
      photo.uploadDate = new Date(photo.createdOn).toDateString();
    });

    // send the html view with our form to the client
    res.render("index", { photos : photos, hasPhotos: !!photos.length, layout: false });
  });
      
});

app.get("/top-package", function(req,res){

  mealModel.find().lean()
  .exec()
  .then((photos) => {
    // underscore ( _ ) is a common library full of utility methods you can use
    // to make certain tasks a lot easier on yourself. Here we use underscore to
    // loop through the photos and and for each photo, set the uploadDate to a 
    // more user friendly date format. http://underscorejs.org/#each
    _.each(photos, (photo) => {
      photo.uploadDate = new Date(photo.createdOn).toDateString();
    });

    // send the html view with our form to the client
    res.render("top-package", { photos : photos, hasPhotos: !!photos.length, layout: false });
  });
  
});

app.get('/registration', (req,res) => {
  res.render('registration', {
    layout: false 
});
})

app.get('/login', (req,res) => {
  res.render('login', {
    layout: false 
});
})


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sepfabi44@gmail.com',
    pass: 'Sepehr12'
  }
});

app.post("/registration", (req,res) =>{

  /*
  const locals = { 
    message: "You are registered successfully",
    layout: false // do not use the default Layout (main.hbs)
  };

  */
  var formData = req.body;
  var errors = dataService.validateUserForm(formData)

  if (!errors.isValid) {
      res.render('registration', {
          data: {"formData": formData, "errors": errors},
          layout: false 
      });
   
  } else {
      
    const userMetadata = new userModel({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
  
    userMetadata.save()
  .then((response) => {
    res.render("registration", locals);
  })
  .catch((err) => {
    locals.message = "There was an error";

    console.log(err);

    res.render("registration", locals);
  });

var mailOptions = {
  from: 'sepfabi44@gmail.com',
  to: req.body.emailAddress,
  subject: 'Welcome '+ req.body.FirstName,
  text: 'Hello ' + req.body.FirstName + ' ' + req.body.LastName + '! You are registered.'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 

res.render('dashboard', {
  data: formData,
  layout: false 
});

}
});

app.post('/login', (req,res) => {
  var formData = req.body;
  var errors = dataService.validateLogin(formData)

  if (!errors.isValid) {
      res.render('login', {
          data: {"formData": formData, "errors": errors},
          layout: false 
      });
   
  } else {
 
    res.render('loginFail', {
      data: registrationData,
      layout: false 
    });
  }
})

/*
var companySchema = new Schema({
  "companyName":  String,
  "address": String,
  "phone": String,
  "employeeCount": {
    "type": Number,
    "default": 0
  },
  "country": String
});

var filmSchema = new Schema({
  "title":  String,
  "director": String,
  "year": Number,
  "country": String
});


// register the Company model using the companySchema
// use the web322_companies collection in the db to store documents
var film = mongoose.model("films", filmSchema);

var taxiDriver = new film({
  title: "Taxi Driver",
  director: "Martin Scorsese",
  year: 1976,
  country: "USA"
})

taxiDriver.save((err) => {
  if(err) {
    console.log("There was an error saving the Kwik-E-Mart company");
  } else {
    console.log("Taxi Driver was saved to the films collection");
  }
  // exit the program after saving
  process.exit();
});

film.findOne({ title: "Taxi Driver" })
   .exec()
  .then((data) => {
         if(!data) {
             console.log("No company could be found");
         } else {
             // Convert the mongoose documents into plain JavaScript objects
             film = data.toObject();

            console.log("film: ", film);
         }
         // exit the program
         process.exit();
     })
     .catch((err) => {
         console.log(`There was an error: ${err}`);
     });
*/
app.get("/all-meals", (req, res) => {
  mealModel.find().lean()
  .exec()
  .then((photos) => {
    // underscore ( _ ) is a common library full of utility methods you can use
    // to make certain tasks a lot easier on yourself. Here we use underscore to
    // loop through the photos and and for each photo, set the uploadDate to a 
    // more user friendly date format. http://underscorejs.org/#each
    _.each(photos, (photo) => {
      photo.uploadDate = new Date(photo.createdOn).toDateString();
    });

    // send the html view with our form to the client
    res.render("all-meals", { photos : photos, hasPhotos: !!photos.length, layout: false });
  });
});

app.get("/add-meal", (req, res) => {
  // send the html view with our form to the client
  res.render("add-meal", { 
    layout: false // do not use the default Layout (main.hbs)
  });
});

app.post("/add-meal", upload.single("photo"), (req, res) => {
  // setup a PhotoModel object and save it
  const locals = { 
    message: "Your photo was uploaded successfully",
    layout: false // do not use the default Layout (main.hbs)
  };

  const mealMetadata = new mealModel({
    name: req.body.name,
    foodCategory: req.body.foodCategory,
    numberOfMeals: req.body.numberOfMeals,
    synopsis: req.body.synopsis,
    price: req.body.price,
    isTopPackage: req.body.isTopPackage,
    filename: req.file.filename
  });

  mealMetadata.save()
  .then((response) => {
    res.render("add-meal", locals);
  })
  .catch((err) => {
    locals.message = "There was an error uploading your photo";

    console.log(err);

    res.render("add-meal", locals);
  });
});

app.post("/remove-photo/:filename", (req, res) => {
  // we are using the url itslef to contain the filename of the photo we
  // want to remove. The :filename part of the url is a dynamic parameter
  // req.params holds the dynamic parameters of a url
  const filename = req.params.filename;

  // remove the photo
  mealModel.remove({filename: filename})
  .then(() => {
    // now remove the file from the file system.
    fs.unlink(PHOTODIRECTORY + filename, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("Removed file : " + filename);
    }); 
    // redirect to home page once the removal is done.
    return res.redirect("/");
  }).catch((err) => {
    // if there was an error removing the photo, log it, and redirect.
    console.log(err);
    return res.redirect("/");
  });
});


app.get("/companies", (req, res) => {
  dataServiceConnect.getAllCompanies().then((companiesData)=>{
    console.log("companiesData", companiesData);
    // res.json(companiesData);
    
    res.render('companies', {
      data: companiesData,
      layout: false // do not use the default Layout (main.hbs)
    }); 
  })
  .catch((err)=>{
      res.status(500).end();
  })
  
});


// Connect to the DB and start the server
// app.listen(HTTP_PORT, onHttpStart);

app.use(express.static('public'))
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
