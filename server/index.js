require('dotenv').config()
const massive = require('massive'),
      session = require('express-session'),
      express = require('express'),
      gradient = require('gradient-string'),
      {CONNECTION_STRING, SESSION_SECRET} = process.env,
      authCtrl = require('./controllers/authController'),
      treasureCtrl = require('./controllers/treasureController')
      auth = require('./middleware/authMiddleware')

//Top level middleware (express)
const app = express()
app.use(express.json())

//Port and listener
const PORT = 4000
app.listen(PORT, () => {
    console.log(gradient.passion(`Listening on port: ${PORT}`));
  });

//Database connection
massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log(gradient.cristal('DB Connected'))
})

//Session setup
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000 * 60}
}))

//**Endpoints**//

//Auth endpoints
app.post('/auth/register', authCtrl.register)
app.post('/auth/login',    authCtrl.login)
app.get('/auth/logout',    authCtrl.logout)

//API endpoints
app.get('/api/treasure/dragon',                treasureCtrl.dragonTreasure)
app.get('/api/treasure/user',  auth.usersOnly, treasureCtrl.getUserTreasure)
app.get('/api/treasure/all',   auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)