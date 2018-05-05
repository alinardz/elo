const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const upload = require('multer')({ dest: './public/pics' });

function checkIfAdmin(req, res, next) {
    if (!req.isAuthenticated()) res.redirect('/login');
    if (req.user.role === "ADMIN") return next();
    return res.redirect('/products');
};

// renderiza vista para editar producto
router.get('/:id/edit', (req, res, next) => {
    Product.findById(req.params.id)
        .then(product => {
            res.render('products/edit', { product });
        })
        .catch(e => next(e))
});

//postea los cambios
router.post('/:id/edit', (req, res, next) => {
    if (req.body.active) req.body.active = true;
    Product.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.redirect('/products/admin');
        })
        .catch(e => next(e));
});

//renderiza los productos del usuario admin
router.get('/admin', checkIfAdmin, (req, res, next) => {
    Promise.all([User.find(), Product.find()])
        .then(r => {
            res.render('products/admin', { users: r[0], products: r[1] });
        })
        .catch(e => next(e));
});

//router.post('/admin', (req,res)=>{}) ????????????

//crear reviews en el producto por su id
router.post('/:id', (req, res) => {
    req.body.user = req.user._id;
    req.body.product = req.params.id;
    Review.create(req.body)
        .then((review => {
            return Product.findByIdAndUpdate(req.params.id, { $push: { reviews: review } })
        }))
        .then(product => {
            res.redirect('/products/' + req.params.id);
        })
        .catch(e => next(e));
});

//renderiza la página de los productos con detalles
router.get('/:id', (req, res) => {
    Product.findById(req.params.id)
        .populate('reviews')
        .populate('user')
        .then(product => {
            res.render('products/detail', { product })
        })
        .catch(e => next(e));
});

router.get('/', (req, res, next) => {
    Product.find({ active: true })
        .populate('user')
        .then(products => res.render('products/list', { products }))
        .catch(e => next(e));
});

//crear nuevo producto 
router.post('/new', upload.array('photos', 6), (req, res, next) => {
    req.body.photos = [];
    for (let pic of req.files) {
        req.body.photos.push('/pics' + pic.filename);
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
        .catch(e => next(e));
});

module.exports = router;