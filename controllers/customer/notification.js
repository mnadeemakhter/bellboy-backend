const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')

const {getNotificationByCustomerId,markNotificationasRead}= require("../../services/notification")
class NotificationController {
    async getNotifications(req, res) {
        try {
            const user_id = req._user_info._user_id;
            const notifications=await getNotificationByCustomerId({customer:user_id})

            return res.send(ResponseService.success({notifications}));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async getSingleNotification(req, res) {
        try {
            const user_id = req._user_info._user_id;
        console.table({_id:req.params.id,customer:user_id})
            const notification=await markNotificationasRead({_id:req.params.id,customer:user_id})
            if(!notification) throw new apiErrors.NotFoundError("notification")
            return res.send(ResponseService.success({notification}));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async markNotificationAsRead(req, res) {
        try {
            const user_id = req._user_info._user_id;
            const notification=await markNotificationasRead({_id:req.params.id,customer:user_id})
            if(!notification) throw new apiErrors.NotFoundError("notification")
            
            return res.send(ResponseService.success({notification}));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new NotificationController();