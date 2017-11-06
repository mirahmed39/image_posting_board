const express = require('express');
const router = express.Router();
const db = require('../db');
const ImagePost = db.ImagePost;
const Image = db.Image;

router.get('/image-posts', function (req, res) {
    res.render('imageposts', {});
});

router.post('/process-post', function (req, res) {
    /*
   get the length of the keys excluding the title. this
   should give an even number. then divide it by two which
   will tell how many image url property we have. then start
   looping. if the url === '', then skip otherwise create an
   image document and push it to the imagepost.
    */
    const title = req.body.title;
    const imagePost = new ImagePost({title:title});
    const numOfImageUrls = (Object.keys(req.body).length - 1) / 2;
    for(let imageUrlNumber = 1; imageUrlNumber <= numOfImageUrls; imageUrlNumber++) {
        if (req.body["img"+imageUrlNumber+"url"] !== '') {
            const image = new Image({caption: req.body["img"+imageUrlNumber+"caption"],
                                     url: req.body["img"+imageUrlNumber+"url"]});
            image.save(function (err, image) {
                if(err) throw err;
                imagePost.images.push(image);
            });
        }
    }
    imagePost.save(function (err, imagePost) {
        if(err) throw err;
        console.log("This is an image post:",imagePost);
        res.redirect('/image-posts');
    });
});


module.exports = router;