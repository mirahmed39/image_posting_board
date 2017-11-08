const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');

// schemas

const ImageSchema = new Schema({
    caption: String,
    url: String
});

const ImagePostSchema = new Schema({
    title: String,
    images: [ImageSchema]
});

// slug plugin (schemaName.plugin(URLSlugs('property name')))
//ImageSchema.plugin(URLSlugs('caption'));
ImagePostSchema.plugin(URLSlugs('title'));

// register the model
const Image = mongoose.model('Image', ImageSchema);
const ImagePost = mongoose.model('ImagePost', ImagePostSchema);

// coonecting to the database
mongoose.connect('mongodb://localhost/hw06');

module.exports = {
  Image:Image,
  ImagePost:ImagePost
};

