const express = require('express');
const router = express.Router();
const db = require('../db');
const ImagePost = db.ImagePost;

router.get('/', function (req, res) {
    res.redirect('/image-posts');
});

router.get('/image-posts', function (req, res) {
    /*
    Need to retrieve all the image posts from the database. and for each image post,
    get the title and all the images, and the title should link to the slug, anf for each image
    display caption and the image itself.
     */
    const errorMessage = req.session.errorMessage;
    ImagePost.find(function (err, imagePosts) {
        console.log("error message:", errorMessage);
        res.render('imageposts', {imagePosts:imagePosts, error:errorMessage});
        delete req.session.errorMessage;
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
    for(let imageUrlNumber = 1; imageUrlNumber <= numOfImageUrls; imageUrlNumber++) {
        if (req.body["img"+imageUrlNumber+"url"] !== '') {
            imagePost.images.push({caption: req.body['img'+imageUrlNumber+'caption'],
                                    url: req.body['img'+imageUrlNumber+'url']});
        }
    }
    imagePost.save(function (err) {
        if(err) {
            /*
            creating an errorMessage property on session so that we can use it even after
            the redirect.(note: redirect completely starts a new request and one way to
            maintain state is to use session)
             */
            req.session.errorMessage = "An Image Post must have a Title\n" +
                "If you are inserting an image, the URL field for that image must be populated.";
            res.redirect('/image-posts');
        } else
            res.redirect('/image-posts');
    });
});

router.get('/image-posts/:slug', function (req, res) {
    const slugForImagePost = req.params['slug'];
    ImagePost.findOne({slug: slugForImagePost}, function (err, anImagePost) {
        if (err) throw err;
        res.render('anImagePost', {anImagePost: anImagePost});
    });
});

router.post('/process-an-image-post', function (req, res) {
    const slugForImagePost = req.body['img-post-slug'];
    const imageUrl = req.body['imgurl'];
    const imageCaption = req.body['imgcaption'];
    const redirectUrlFormat = '/image-posts/' + slugForImagePost;

    ImagePost.findOneAndUpdate({slug:slugForImagePost}, {$push: {images: {caption:imageCaption, url:imageUrl}}}, function(err, anImagePost) {
        if(err) {
            console.log("An error occured");
            const errorMessage = "If you are inserting an image, the URL field for that image must be populated.";
            //res.render('anImagePost', {errorMessage: errorMessage, anImagePost: anImagePost});
            res.redirect(redirectUrlFormat, {errorMessage:errorMessage});
        } else {
            console.log("Add operation successfully executed");
            res.redirect(redirectUrlFormat);
        }
    });
});

router.post('/remove-image', function (req, res) {
    const slugForImagePost = req.body['img-post-slug'];
    const checkedImages = req.body['image-checkbox'];
    const redirectUrlFormat = '/image-posts/' + slugForImagePost;
    // check to see if the uses has selected multiple images.
    if(Array.isArray(checkedImages)) {
        for(let imageId of checkedImages) {
            ImagePost.findOneAndUpdate({slug: slugForImagePost}, {$pull: {images: {_id: imageId}}} , function (err) {
                if(err) throw err;
                console.log("Remove operation successfully executed");
            });
        }
        res.redirect(redirectUrlFormat);
    } else {
        ImagePost.findOneAndUpdate({slug: slugForImagePost}, {$pull: {images: {_id: checkedImages}}} , function (err) {
            if(err) throw err;
            console.log("Remove operation successfully executed");
        });
        res.redirect(redirectUrlFormat);
    }
});

module.exports = router;