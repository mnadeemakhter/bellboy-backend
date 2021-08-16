const express = require('express')
const router = express.Router();
const jwtAuth = require('../../../middlewares/jwt-auth')

const NotificationController = require('../../../controllers/customer/notification')

router.get('/', jwtAuth, NotificationController.getNotifications);
router.get('/:id', jwtAuth, NotificationController.getSingleNotification);
router.patch('/:id', jwtAuth, NotificationController.markNotificationAsRead);



module.exports = router;