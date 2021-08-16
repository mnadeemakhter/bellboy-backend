const express = require("express");
const router = express.Router();
const multer = require("../../../common/multer");

const NotificationController = require("../../../controllers/admin/notification");
router.post(
  "/singledevice",
  multer.single('notificationImg'),
  NotificationController.sendNotificationToSingleDevice
);

router.post(
  "/multipledevice",
  
  multer.single('notificationImg'),
  NotificationController.sendNotificationToMultipleDevice
);
// working
router.post(
  "/totopic",
  
  NotificationController.sendNotificationToTopic
);
router.post("/sendtoPakistaniUsers",multer.single('notificationImg'),  NotificationController.sendNotificationToPakistaniUser);


router.get("/getNotification",  NotificationController.getNotfications);

// sendNotificationToPakistaniUser

router
  .route("/:id")
  .get( NotificationController.getSingleNotification)
  // .delete(jwtAuth, NotificationController.deleteNotfication);

module.exports = router;
