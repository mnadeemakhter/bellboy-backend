const BellBoyService = require('../../services/bell-boy')
const BellBoyTypeService = require('../../services/bellboy-type')
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')
const VehicleService = require('../../services/vehicle')
const HiringService = require('../../services/hirings')
class DashboardController {
    async getDashboard(req, res) {
        try {

            let data = Object.assign({}, req.query);
           

            const user_id = req._user_info._user_id;
            let bellBoy = await BellBoyService.getBellboyForDashboard({ _id: user_id });
            if (!bellBoy) throw new apiErrors.ValidationError('token', messages.AUTHENTICATION_ERROR)



            let bellBoyTypes = await BellBoyTypeService.getBellBoyTypes({ status: true }, { _id: '5f5da852abd69550176fad72' });

            let request = {
                status: { $gte: 2, $lte: 3 },
                bellboy: user_id,
            };



            let hirings = await HiringService.getHiringsForBellBoyDashboard(request)

          
            let dashboard = {};
            dashboard['profile'] = bellBoy;
            dashboard['types'] = bellBoyTypes;
            dashboard['hiring'] = null;
            if (bellBoy.working_status && hirings.length > 0) dashboard['hiring'] = hirings[0];
            return res.send(ResponseService.success({
                dashboard
            }));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }


}

module.exports = new DashboardController();