const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const connectivity = require('../middleware/connectivity');
const {eventController,agendaControlller, attendanceController,loginController,adminController} = require('../controllers/index')

router.post('/register',eventController.registerMember);

router.post('/attendance',attendanceController.attendance);

router.post('/agenda',agendaControlller.agendaDetails);

router.get('/agendaFilters',agendaControlller.agendaFilters);

router.get('/favoriteDetail',agendaControlller.favoriteDetails);

router.post('/favorite',agendaControlller.favoriteAgenda);

router.post('/loginOtp',loginController.loginOtp);

router.post('/login',loginController.login);

router.post('/showQr',auth.verifyToken,loginController.memberDetails);

router.post('/logout',loginController.logout);

router.post('/admin/login',adminController.login);

router.get('/admin/eventRecord',auth.verifyToken,adminController.participantDetails);

router.post('/admin/manageMember',auth.verifyToken,adminController.manageMembers);

router.get('/admin/waitingMembers',auth.verifyToken,adminController.waitingMemberDetails);

router.post('/admin/logout',adminController.logout);

router.get('/', (req, res) => {
   res.json({ message: 'success' });
});

module.exports = router
