const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')
const ComplaintService = require('../../services/complaints')


class ComplaintController {

    async getComplaints(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let pageNo = parseInt(req.query.pageNo || 1)
            let perPage = parseInt(req.query.perPage || 10)
            let search = (req.query.search || '').toLowerCase();

            let total = await ComplaintService.ComplaintTotalCount({ subject: new RegExp(search, 'i'), customer: user_id })

            let complaints = await ComplaintService.getComplaints({ subject: new RegExp(search, 'i'), customer: user_id }, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ complaints, count: total }))
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async addComplaint(req, res) {
        try {

            const user_id = req._user_info._user_id;

            var data = Object.assign({}, req.body);

            if (!data.subject) throw new apiErrors.ValidationError('subject', 'Subject Required');
            if (!data.email) throw new apiErrors.ValidationError('email', messages.EMAIL_VALIDATION);
            if (!data.message) throw new apiErrors.ValidationError('message', messages.MESSAGE_VALIDATION);
            data.customer = user_id;

            let complaint = await ComplaintService.addComplaint(data);
          
            let getComplaint = await ComplaintService.getComplaint({_id:complaint._id});



            return res.send(ResponseService.success(getComplaint,'Your Complaint has been submitted. We will contact you soon. Thank You'));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new ComplaintController();