require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const nodeCommands = require('./routes/nodeCommands')
const linkCommands = require('./routes/linkCommands')
const cors = require('cors')

// express app 
const app = express()

// process json 

app.use(express.json())

const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}

app.use(cors(corsOptions));

// routes
app.use('/api/commands', nodeCommands)
app.use('/api/link', linkCommands)


//connect to mongoose

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("WORKS on port 4000 and connected to Database")
        })
    })
    .catch((error: Error) => {
        console.log(error)
    })

