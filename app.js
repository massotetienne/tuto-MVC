// ==== constantes ====

const express    = require ('express');
const exphbs     = require ('express-handlebars');
const mongoose   = require ('mongoose');
const bodyParser = require ('body-parser');
const fileupload = require ('express-fileupload');



// ==== Controller ====

// article
const articleAddController    = require ('./controllers/articleAdd')
const homePage                = require ('./controllers/homePage')
const articleSingleController = require ('./controllers/articleSingle')
const articlePostController   = require ('./controllers/articlePost')

// user
const userCreate    = require ('./controllers/userCreate')
const userRegister  = require ('./controllers/userRegister')
const userLogin     = require ('./controllers/userLogin')
const userLoginAuth = require ('./controllers/userLoginAuth')

const app = express();


// ==== dotenv ===== (crypter les clé etc...)
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var Handlebars    = require  ("handlebars");
var MomentHandler = require  ("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);
// 

// ===bodyParser===
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use(fileupload())
// ==== const Post ====


// === Express===
app.use(express.static('public'));

require('./console')

//==== route ====
app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set   ('view engine','handlebars');



// ====middleware==== //
const articleValidPost = require('./middleware/articleValidPost');

app.use("/articles/post",articleValidPost)

// ==== Get ==== 
app.get ("/",  homePage)

//==== Articles ====
app.get ("/articles/add",articleAddController)
app.get ("/articles/:id",articleSingleController)
app.post("/articles/post",articlePostController)

// ==== user ====
app.get ('/user/create',userCreate)
app.post('/user/register',userRegister)
app.get('/user/login', userLogin)
app.post('/user/loginAuth', userLoginAuth)


// ==== contact ====
app.get ("/contact",(req,res) => {
    res.render("contact")
})

// ==== Port ====
app.listen(3000, ()=> {
    console.log("le serveur tourne sur le port 3000");
})