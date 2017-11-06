const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');

// schemas

const ImageSchema = new Schema({
    caption: Stringtring,
    url: String
});

const ImagePostSchema = new Schema({
    title: String,
    images: [ImageSchema]
});

// slug plugin (schemaName.plugin(URLSlugs('property name')))
ImageSchema.plugin('caption');
ImagePostSchema.plugin('title');

// register the model
mongoose.model('Image', ImageSchema);
mongoose.model('ImagePost', ImagePostSchema);

// coonecting to the database
mongoose.connect('mongodb://localhost/hw06');