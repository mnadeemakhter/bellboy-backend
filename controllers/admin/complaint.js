const ComplaintService = require('./../../services/complaints')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class ComplaintController {


    async getComplaints(req, res) {
        try {

            let total = await ComplaintService.ComplaintTotalCount()

            let complaints = await ComplaintService.getComplaints()

            return res.status(200).send(ResponseService.success({ complaints, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
    async deleteComplain(req,res){
        try {
            // req._user_info._user_id
            let data = Object.assign({}, req.params);

            if (!data.complaint_id) throw new apiErrors.ValidationError('complaint_id', messages.ID_VALIDATION);

            let complaint=await ComplaintService.deleteComplaint({_id:req.params.complaint_id},req._user_info._user_id)
            console.log(complaint)
            return res.status(200).send(ResponseService.success({ deleted:true }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error));
        }
    }
    async addComplaint(req,res){
        try {
            let data = Object.assign({}, req.body);
            // data.d1=Date.now();
            console.log("data.d1",data.d1)
            const complaint =await  ComplaintService.addComplaint(data);
            return res.status(200).send(ResponseService.success(complaint))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error));
        }
    }
}

module.exports = new ComplaintController();