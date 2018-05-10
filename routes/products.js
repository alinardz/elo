const express = require('express');
const router = express.Router();
const Product = require("../models/Product");

const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

var storage = cloudinaryStorage({
    cloudinary,
    folder: 'uploads',
    allowedFormats: ['jpg', 'png'],
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadCloud = multer({ storage: storage });

////////////////////// CREAR NUEVO PRODUCTO   //////////////////////
//renderiza página para crear nuevo producto
router.get('/nuevo', (req, res) => {
    res.render('products/nuevo', { error: req.body.error });
});

//agrega el nuevo producto a la base de datos y sube imágenes a cloudinary
router.post("/nuevo", uploadCloud.array("photos", 12), (req, res, next) => {
    req.body.photos = [];
    for (let pic of req.files) {
        req.body.photos.push(pic.url);
    }
    Product.create(req.body)
        .then(res.redirect('/'))
        .catch(e => next(e))
});

module.exports = router;