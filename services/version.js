const Version = require('./../models/versionControll')

class VersionService {
    addVersion(request){
        return new Version(request).save();
    }
    getVersion(request){
        return  Version.findOne(request)
        .populate("addedBy","name email avatar")
        .populate("activatedBy","name email avatar")
        .populate("deActivatedBy","name email avatar")
        .sort("-created_at")
    }
    getVersions(request){
        return  Version.find(request)
        .populate("addedBy","name email avatar")
        .populate("activatedBy","name email avatar")
        .populate("deActivatedBy","name email avatar")
        .sort("-created_at")
    }
    deactivateAllVersion(request,data){
        return Version.updateMany(request,{$set:{active:false,...data}});
    }
    activateVersion(request,data){
        return Version.findOneAndUpdate(request,{active:true,...data},{new:true});
    }
    deActivateVersion(request,data){
        return Version.findOneAndUpdate(request,{active:false,...data},{new:true});
    }

}

module.exports = new VersionService();