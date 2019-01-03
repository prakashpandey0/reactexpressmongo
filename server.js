const express = require('express');
const app     = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

//Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//DB config
const db     =  require('./config/keys').mongoUri

//connect to mongodb

mongoose.connect(db)
        .then( () => console.log("mongodb connected !"))
        .catch( err => console.log(err))


app.get('/', (req, res) => res.send("Hello React") )

//use routes

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started at ${port}`));
