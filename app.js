//import libraries (source: [1])
const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')

//create app and routing (source: [1])
const app = express()

const bodyParser = require('body-parser')
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')
const commentsRoute = require('./routes/comments')
const likesRoute = require('./routes/likes')

//middleware (source: [1] [3])
app.use(bodyParser.json())
app.use('/users', authRoute)
app.use('/posts', postsRoute)
app.use('/comments', commentsRoute)
app.use('/likes', likesRoute)

//routes (source: [1])
app.get('/', (req, res) => {
    res.send('homepage')
})

//conect to database
//workaround to log database connection confirmation since Mongoose.prototype.connect() no longer accepts a callback (source:[2])
const connectToMongo = () => {
    mongoose.connect(process.env.DB_CONNECTOR)
    .then(() => console.log('Connected to mongoDB.'))
    .catch((err) => console.log('Database connection failed.'));
}
connectToMongo()

//create server (source: [1])
app.listen(3000, () => {
    console.log('Server is up and running.')
})