require('dotenv').config()
require('express-async-errors')



//extra security package
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


//Swagger
const swaggerUI  = require('swagger-ui-express')
const YAML = require("yamljs")
const swaggerDocument = YAML.load('./swagger.yaml')



const express = require("express");
const app = express()


//connect database
const connectDB = require('./database/connectdb')
const authUser = require('./middlewares/auth')

//routers
const authRouter = require('./routers/auth')
const jobRouter = require('./routers/jobs')

//error handlers
const notFoundMiddleware = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')


app.set()
app.use(rateLimiter({
  windowMS: 15 * 60 * 1000, //15 minutes
  max: 100, //limit each IP to 100 requests per windows
}));
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())


app.get('/', (req, res) => {
  res.send('<h1>Jobs API </h1><a href="/api-docs">Documentation</a>')
})
//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs',authUser, jobRouter)
app.get('/', (req, res) => {
    res.send('jobs api')
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000


const start = async() => {
  console.log("running")
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
    } 
}


start()
