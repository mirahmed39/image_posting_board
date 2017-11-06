const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require('./db');
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
// setting session options (code used from online slides)
const sessionOptions = {
    secret: 'secret for signing session id',
    saveUninitialized: false,
    resave: false
};
app.set('views', path.join(__dirname, 'views'));
app.use(session(sessionOptions));
app.use(cookieParser());
app.set('view engine', 'hbs');
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));

// getting the route and using it.
const route = require('./routes/app-routes');
app.use('/', route);


app.listen(process.env.PORT || 3000);