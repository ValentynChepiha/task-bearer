const Router = require('express').Router;
const userController = require('../controllers/user.controller');
const validatorMiddleware = require('./../middlewares/validate.middleware');
const authMiddleware = require('./../middlewares/auth.middleware');

const router = Router();

router.post('/signup', validatorMiddleware, userController.signUp);
router.post('/signin', userController.signIn);

router.get('/info', authMiddleware, userController.getInfo);
router.get('/latency', authMiddleware, userController.latency);

router.get('/logout', userController.logout);

module.exports = router;