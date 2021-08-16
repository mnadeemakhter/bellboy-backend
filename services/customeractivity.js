const AdminService = require('./admin')
const CustomerActivity = require('../models/customeractivity')
const CustomerService= require("./customer")
// const BellBoyService = require('./bell-boy')
class CustomerActivityService {

    newActivity(request) {
        return new CustomerActivity(request);
    }
    addActivity(request){
        return CustomerActivity.findOne(request);
    }
    findActivity(request){
        return CustomerActivity.findOne(request);
    }

    async main(removedUser){
        const date = new Date();
  
        let activity = await this.findActivity({
          customer: removedUser._id,
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
            customer: removedUser._id,
          });
        }
  
        activity.track.push({
          start: removedUser.start,
          end: Date.now(),
          date: Date.now(),
        });

        await Promise.all([
          activity.save(),
          CustomerService.updateCustomerLastSeen({_id:removedUser._id})
        ])
    }
}

module.exports = new CustomerActivityService();