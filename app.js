// ==== constantes ====

const express  = require ('express');
const exphbs   = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = express();


// ==== dotenv ===== (crypter les clé etc...)
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var Handlebars = require("handlebars");
var MomentHandler = require ("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);
// 

// ===bodyParser===
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

// ==== const Post ====
const Post = require ("./database/models/Article")

// === Express===
app.use(express.static('public'));

require('./console')

//==== route ====
app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

// ==== Get ==== 
app.get ("/", async (req,res) => {
    
    const post = await Post.find({})
    console.log(post);

    res.render("index",{post} )  
})

app.get ("/contact",(req,res) => {
    res.render("contact")
})

//==== Articles ====


app.get("/articles/:id", async (req,res) => {

    console.log(req.params);

    const article = await Post.findById(req.params.id)

    res.render("articles",  {article})

})




app.get("/article/add",(req,res)=>{
    res.render("article/add")
})

//==== post =====
app.post("/articles/post",(req,res)=>{

    Post.create(req.body,(error,post)=>{
        res.redirect('/')

    })
    console.log(req.body);

    res.redirect('/')
})

// ==== Port ====
app.listen(3000, ()=> {
    console.log("le serveur tourne sur le port 3000");
})