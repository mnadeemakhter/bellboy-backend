const AdminService = require('./admin')
const AdminActivity = require('../models/adminactivity')
// const BellBoyService = require('./bell-boy')
class AdminActivityService {

    newActivity(request) {
        return new AdminActivity(request);
    }
    addActivity(request){
        return AdminActivity.findOne(request);
    }
    findActivity(request){
        return AdminActivity.findOne(request);
    }

    async main(removedUser){
        const date = new Date();
  
        let activity = await this.findActivity({
          admin: removedUser._id,
          $expr: {
            $and: [
              {
                $eq: [{ $year: "$created_at" }, date.getFullYear()],
              },
              {
                $eq: [{ $month: "$created_at" }, date.getMonth() + 1],
              },
              {
                $eq: [{ $dayOfMonth: "$created_at" }, date.getDate()],
              },
            ],
          },
        });
        if (!activity) {
          activity = this.newActivity({
            admin: removedUser._id,
          });
        }
  
        activity.track.push({
          start: removedUser.start,
          end: Date.now(),
          date: Date.now(),
        });
        await Promise.all([
         activity.save(),
         AdminService.updateAdminLastSeen({_id:removedUser._id})
        ])
    }
}

module.exports = new AdminActivityService();