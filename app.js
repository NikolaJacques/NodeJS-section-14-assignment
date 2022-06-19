const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const errorController = require('./controllers/error');

const app = express();

const uri = process.env.START_URI + encodeURIComponent(process.env.PASSWORD) + process.env.END_URI;

const store = new MongoDBStore({
  uri,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({ secret: process.env.SECRET, 
            resave: false, 
            saveUninitialized: false,
            cookie: {
              expires: false
            }, 
            store })
);

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(uri)
  .then(() => {
    app.listen(3000);
    console.log('Listening on port 3000');
  })
  .catch(err => console.log(err));
