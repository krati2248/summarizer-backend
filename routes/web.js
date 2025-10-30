const express = require('express');
const route = express.Router();
const UserController = require('../controllers/UserController');
const SummaryController = require('../controllers/SummaryController');
const auth = require('../middlewares/auth');

//User route
route.post('/register', UserController.register);
route.post('/login', UserController.login);
route.get('/logout', UserController.logout);
route.get('/me', auth, UserController.getData);
route.post('/auth/google', UserController.login);
route.get('/logout',auth, UserController.logout);
route.get('/profile', auth, UserController.getProfile);

//Summary route
route.post('/createsummary',auth, SummaryController.createSummary);
route.get('/getAll', auth, SummaryController.getAll);
route.get('/getSummary/:id', auth, SummaryController.getSummary);
route.delete('/delete/:id', auth, SummaryController.deleteSummary);

 
module.exports = route;
