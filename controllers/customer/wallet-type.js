const WalletTypeService = require('./../../services/wallet-types')
const LabelService = require('./../../services/labels')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class WalletTypeController {


    async getActiveWalletTypes(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let total = await WalletTypeService.WalletTypeTotalCount({ title: new RegExp(search, 'i'), status: true })

            let WalletTypes = await WalletTypeService.getWalletTypes({ title: new RegExp(search, 'i'), status: true }, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ WalletTypes, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }


}

module.exports = new WalletTypeController();