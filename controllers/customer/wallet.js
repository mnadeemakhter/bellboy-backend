
const HiringService = require('../../services/hirings')
const CustomerService = require('../../services/customer')
const ResponseService = require('../../common/response')
const HelperService = require('../../common/helper')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')

const LocalizationService = require('../../common/localization')
const LocaleService = require('../../services/locales')

const moment = require('moment');



class walletController {

    async getWallet(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let customer = await CustomerService.getCustomer({ _id: user_id });




            let today = moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZZ")
            let currentDate = new Date(today);
            let dayStart = currentDate.setHours(0,0,0,0);
            let dayEnd = currentDate.setHours(23,59,59,999);

            let startEndOfWeek = HelperService.startAndEndOfWeek(currentDate);
            let startEndOfMonth = HelperService.startAndEndOfMonth();
            let startEndOfYear = HelperService.startAndEndOfYear();



            let requestForToday = {
                status: 4,
                customer: user_id,
                is_completed: true,
                created_at: { $gte: dayStart, $lte: dayEnd }
            };

            let requestForWeek = {
                status: 4,
                customer: user_id,
                is_completed: true,
                created_at: { $gte: startEndOfWeek[0], $lte: startEndOfWeek[1] }
            };

            let requestForMonth = {
                status: 4,
                customer: user_id,
                is_completed: true,
                created_at: { $gte: startEndOfMonth[0], $lte: startEndOfMonth[1] }
            };
            let requestForYear = {
                status: 4,
                customer: user_id,
                is_completed: true,
                created_at: { $gte: startEndOfYear[0], $lte: startEndOfYear[1] }
            };

            let hiringsOfToday = await HiringService.getHiringsSimply(requestForToday)

            let hiringsOfWeek = await HiringService.getHiringsSimply(requestForWeek)

            let hiringsOfMonth = await HiringService.getHiringsSimply(requestForMonth)

            let hiringsOfYear = await HiringService.getHiringsSimply(requestForYear)

            let transactionsOfToday = await HelperService.getTransactions(hiringsOfToday);
            let transactionsOfWeek = await HelperService.getTransactions(hiringsOfWeek);
            let transactionsOfMonth = await HelperService.getTransactions(hiringsOfMonth);
            let transactionsOfYear = await HelperService.getTransactions(hiringsOfYear);


            return res.status(200).send(ResponseService.success({
                transactionsOfToday,
                transactionsOfWeek,
                transactionsOfMonth,
                transactionsOfYear,
                wallet: customer.wallet,

            }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }




}

module.exports = new walletController();