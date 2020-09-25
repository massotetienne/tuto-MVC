const express = require ('express');

const app = express();


// route

app.get ("/",function(req,res) {
    res.send("coucou")
})

app.listen(3000, function() {
    console.log("le serveur tourne sur le port 3000");
})