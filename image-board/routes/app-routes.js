const express = require('express');
const router = express.Router();
const db = require('../db');
const ImagePost = db.ImagePost;

router.get('/image-posts', function (req, res) {
    /*
    Need to retrieve all the image posts from the database. and for each image post,
    get the title and all the images, and the title should link to the slug, anf for each image
    display caption and the image itself.
     */
    ImagePost.find(function (err, imagePosts) {
        res.render('imageposts', {imagePosts:imagePosts});
    });
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
    console.log("Nubmer of image urls: ", numOfImageUrls);
    for(let imageUrlNumber = 1; imageUrlNumber <= numOfImageUrls; imageUrlNumber++) {
        if (req.body["img"+imageUrlNumber+"url"] !== '') {
            //console.log("Image url number: ", "img"+imageUrlNumber+"url");
            imagePost.images.push({caption: req.body['img'+imageUrlNumber+'caption'],
                                    url: req.body['img'+imageUrlNumber+'url']});
        }
    }
    //console.log('ImagePost:', imagePost);
    imagePost.save(function (err, imagePost) {
        if(err) throw console.log(err);
        console.log("These are the images inside the image post:",imagePost);
        res.redirect('/image-posts');
    });
});

router.get('/image-posts/:slug', function (req, res) {
    const slugForImagePost = req.params['slug'];
    ImagePost.findOne({slug: slugForImagePost}, function (err, anImagePost) {
        if (err) throw err;
        console.log("Image post requested:", anImagePost);
        res.render('anImagePost', {anImagePost: anImagePost});
    });
});

router.post('/process-an-image-post', function (req, res) {
    const slugForImagePost = req.body['img-post-slug'];
    const imageUrl = req.body['imgurl'];
    const imageCaption = req.body['imgcaption'];
    const redirectUrlFormat = '/image-posts/' + slugForImagePost;
    console.log("Image post slug:",slugForImagePost);
    console.log("Image url:",imageUrl);
    console.log("Image post caption:",imageCaption);

    ImagePost.findOneAndUpdate({slug:slugForImagePost}, {$push: {images: {caption:imageCaption, url:imageUrl}}}, function(err, anImagePost, count) {
        console.log("This is updated:", anImagePost);
        res.redirect(redirectUrlFormat);
    });
});


module.exports = router;