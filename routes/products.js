const express = require('express');
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
//const Review = require("../models/Review");

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


function checkIfAdmin(req, res, next) {
    if (!req.isAuthenticated()) res.redirect('/login');
    if (req.user.role === "ADMIN") return next();
    return res.redirect('/products');
}

////////////////////////// PRODUCT DETAIL //////////////////////////
router.get('/detail/:id', (req, res, next) => {
    let _id = req.params.id;
    Product.findById(_id)
        .then(product => {
            res.render('products/detail', product);
        })
        .catch(e => next(e))
});

////////////////////////// EDIT PRODUCTS //////////////////////////
router.get('/edit/:id', (req, res, next) => {
    let _id = req.params.id;
    Product.findById(_id)
        .then(product => {
            res.render('products/edit', product);
        })
        .catch(e => next(e))
})

/* router.post('/edit/:id', (req, res, next) => {
    let _id = req.body.id;
    let _name = req.body.name;
    let _description = req.body.description;
    let _price = req.body.price;
    let _stock = req.body.stock;
    let _photos = req.body.photos;
    Product.findByIdAndUpdate(req.params.id, {
        name: _name,
    }, (err) => {
        if (err) {
            console.log(err);
            next();
            return;
        } else {
            res.redirect('/profile')
        }
    });
}); */

router.post('/edit/:id', (req, res, next) => {
    let _id = req.body.id;
    console.log("este es el body goe" + _id)
        //if (req.body.active) req.body.active = true;
    Product.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.redirect('/profile');
        })
        .catch(e => next(e))
})




////////////////////////// DELETE PRODUCTS //////////////////////////
router.post('/delete/:id', (req, res, next) => {
    let _id = req.params.id;
    Product.findByIdAndRemove(_id, (err, docs) => {
        if (err) {
            next();
            return;
        } else {
            res.redirect("/profile")
        }
    });
});

////////////////////////// ADMIN PROFILE //////////////////////////
router.get('/admin', checkIfAdmin, (req, res, next) => {
    Promise.all([User.find(), Product.find()])
        .then(r => {
            res.render('products/admin', { users: r[0], products: r[1] });
        })
        .catch(e => next(e));
})

////////////////////////// REVIEW PRODUCTS //////////////////////////
// router.post('/:id', (req, res) => {
//     req.body.user = req.user._id;
//     req.body.product = req.params.id;
//     Comment.create(req.body)
//         .then((comment => {
//             return Product.findByIdAndUpdate(req.params.id, { $push: { comments: comment } })
//         }))
//         .then(product => {
//             res.redirect('/products/' + req.params.id);
//         })
//         .catch(e => next(e));
// });

//// Display products reviews
// router.get('/:id', (req, res, next) => {
//     Product.findById(req.params.id)
//         .populate('comments')
//         .populate('user')
//         .then(product => {
//             res.render('products/detail', { product })
//         })
//         .catch(e => next(e));
// });



//// Display products
router.get('/', (req, res, next) => {
    Product.find({ active: true })
        .populate('user')
        .then(products => res.render('products/list', { products }))
        .catch(e => next(e));
});


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
    req.body.user = req.user._id;
    Product.create(req.body)
        .then(product => {
            req.user.products.push(product._id);
            return User.findByIdAndUpdate(req.user._id, req.user)
        })
        .then(user => {
            res.redirect('/profile')
        })
        .catch(e => next(e))
});

module.exports = router;