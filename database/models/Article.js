const mongoose = require ('mongoose')

const ArticleShema = new mongoose.Schema({
    
    title:String,
    content:String,
    author:String,
    createDate: {
        type:Date,
        default : new Date()
    }
})

const Article = mongoose.model('Article',ArticleShema)

module.exports = Article