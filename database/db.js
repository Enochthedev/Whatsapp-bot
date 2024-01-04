const mongoose = require('mongoose');
const { MongoStore } = require('wwebjs-mongo');

mongoose.connect(process.env.MONGODB_URI).then(() => {
    store = new MongoStore({ mongoose: mongoose });
    console.log('Connected to database')
}).catch(err => {
    console.log(err)
});


//create store
const store = new MongoStore({ mongoose: mongoose });

//export store
module.exports = {
    store
}