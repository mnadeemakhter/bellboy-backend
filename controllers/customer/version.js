const {getVersion} = require('./../../services/version')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')

class VersionController {
    async getVersion(req, res) {
        try {
            console.log(req.query.version)
            const version = await getVersion({version:req.query.version,active:true})
            if(version) return res.status(200).send(ResponseService.success({active:true}))
            else{
                return res.status(200).send(ResponseService.success({active:false}))
            } 
        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
}

module.exports = new VersionController();