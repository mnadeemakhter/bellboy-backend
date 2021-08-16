const messages = require('../../common/messages');
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const {addVersion,getVersion,getVersions,deactivateAllVersion,activateVersion,deActivateVersion}=require("../../services/version");
class VersionController{
    async addNewVersion(req,res){
        try {
            console.log(req._user_info);
            let data = Object.assign({}, req.body);
            let version
            console.log(data)
            if (!data.version) throw new apiErrors.ValidationError('version', messages.VERSION_VALIDATION)

             version = await getVersion({version:data.version});
             if(version) throw new apiErrors.ResourceAlreadyExistError("version","Version Already Exists");
             version= await addVersion({
                ...data,
                addedBy: req._user_info._user_id
            });
            return res.status(200).send(ResponseService.success({version}));
        } catch (error) {
            return res.send(ResponseService.failure(error));
        }
    }
    async getSingleVersion(req,res){
        try {

            const version=await getVersion({_id:req.params.id});
            if(!version) throw new apiErrors.ResourceNotFoundError("version")
            return res.status(200).send(ResponseService.success({version}));
            
        } catch (error) {
            return res.send(ResponseService.failure(error));
        }
    }
    async getListVersion(req,res){
        try {
            const versions=await getVersions({});
            return res.status(200).send(ResponseService.success({versions}));  
        } catch (error) {
            return res.send(ResponseService.failure(error));
        }
    }
    async activateNewVersion(req,res){
        try {
            // await deactivateAllVersion({_id:{
            //     $nin:[req.params.id]
            // }},{deActivatedBy:req._user_info._user_id,deactiveDate:Date.now()});
            const version= await activateVersion({_id:req.params.id},{activatedBy:req._user_info._user_id,activeDate:Date.now()});
            return res.status(200).send(ResponseService.success({version}));
        } catch (error) {
            return res.send(ResponseService.failure(error));
            
        }
    }
    async deActivateVersion(req,res){
        try {
            const version= await deActivateVersion({_id:req.params.id},{deActivatedBy:req._user_info._user_id,deactiveDate:Date.now()});
            return res.status(200).send(ResponseService.success({version}));
        } catch (error) {
            return res.send(ResponseService.failure(error));
            
        }
    }
}

module.exports = new VersionController();