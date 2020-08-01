/*
 * Author: Rohit Bhure
 * Date : 26/07/2020
 * Useability: Server Startup and checking the database connection
 */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require('helmet');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// connecting mongo
mongoose.connect(
    'mongodb://localhost:27017/inventorydb', { useNewUrlParser: true, useUnifiedTopology: true  }
);

// When successfully connected
mongoose.connection.on('connected', function () {  
    console.log('Mongoose default connection open');
}); 

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
    console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
    console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
      console.log('Mongoose default connection disconnected through app termination'); 
      process.exit(0); 
    }); 
}); 

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

const accountRoutes = require('./api/routes/accounts');
const inventoryRoutes = require('./api/routes/inventory');
const ordersRoutes = require('./api/routes/orders');


app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(helmet.hidePoweredBy());

app.use('/accounts', accountRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/order', ordersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.set('port', process.env.PORT || 9001);

try {
    app.listen(app.get('port'), function () {
        console.log('Listening on port 9001...');
    })
} catch(err){
    console.log("Error in Dbconnection",err)
}
