// ==== constantes ====

const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const connectFlash = require('connect-flash');
const {stripTags}   = require ('./helpers/hbs');

// ==== article ====
const articleAddController = require('./controllers/articleAdd')
const homePage = require('./controllers/homePage')
const articleSingleController = require('./controllers/articleSingle')
const articlePostController = require('./controllers/articlePost')

// ==== user ====
const userCreate = require('./controllers/userCreate')
const userRegister = require('./controllers/userRegister')
const userLogin = require('./controllers/userLogin')
const userLoginAuth = require('./controllers/userLoginAuth')
const userLogout = require('./controllers/userLogout')
const app = express();


// ==== dotenv ===== (crypter les clé etc...)
require('dotenv').config()

// console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const mongoStore = MongoStore(expressSession)

app.use(connectFlash())

app.use(expressSession({
    secret: 'securite',
    name: 'biscuit',
    saveUninitialized: true,
    resave: false,

    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}))

var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);
// 

// ====bodyParser====
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(fileupload())

const auth = require('./middleware/auth');
const redirectAuthSucess = require('./middleware/redirectAuthSucess')

// ==== Express====
app.use(express.static('public'));

require('./console')

//==== route ====
app.engine('handlebars', exphbs({
    helpers : {
        stripTags : stripTags
    },

    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use('*', (req, res, next) => {
    res.locals.user = req.session.userId;
    console.log(res.locals.user);
    next()
})


// ====middleware==== //
const articleValidPost = require('./middleware/articleValidPost');
app.use("/article/post", articleValidPost)


// ==== Get ==== 
app.get("/", homePage)


//==== Articles ====
app.get("/articles/add",auth,articleAddController)
app.get("/articles/:id", articleSingleController)
app.post("/articles/post", auth, articleValidPost, articlePostController)

// ==== user ====
app.get('/user/create', redirectAuthSucess, userCreate)
app.post('/user/register', redirectAuthSucess, userRegister)
app.get('/user/login', redirectAuthSucess, userLogin)
app.post('/user/loginAuth', redirectAuthSucess, userLoginAuth)
app.get('/user/logout', userLogout)


// ==== contact ====
app.get("/contact", (req, res) => {
    res.render("contact")
})

// error 404 
app.use((req, res) => {
    res.render('error404')
})

// ==== Port ====
app.listen(3000, () => {
    console.log("le serveur tourne sur le port 3000");
})