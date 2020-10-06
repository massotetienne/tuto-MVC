const Article = require('../database/models/Article')
const path = require('path')

module.exports = (req, res) => {

    const b = req.body
    const q = req.params.id
    const f = req.files

    console.log('Controller Form Edit !')
    console.log(b);
    console.log(f);

    if (f) {
        const { image } = req.files

        // console.log(image)

        const uploadFile = path.resolve(__dirname, '..', 'public/articles', image.name)

        image.mv(uploadFile, (error) => {
            Article.findByIdAndUpdate( q, {
                ...req.body,
                image: `/articles/${image.name}`
            }, (error, post) => {
                res.redirect('/')

            })
        })
    } else {

        Article.findByIdAndUpdate(q, {
            title: b.title,
            content: b.content,
            author: b.author,

        }, (err, d) => {
            console.log(d)
            if (err) console.log(err)
            res.redirect('/articles/edit/' + q)
        })
    }



}