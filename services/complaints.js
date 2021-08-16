const Complaint = require('./../models/complaint')

class ComplaintService {
    addComplaint(request) {
        return new Complaint(request).save();
    }

    getComplaints(request) {
        return Complaint.find(request).populate({path:'customer',select:'name email mobile'}).select("-deleted -__v -updated_at");
    }

    getComplaint(request) {
        return Complaint.findOne(request).populate({path:'customer',select:'name email mobile'});
    }

    ComplaintTotalCount(request) {
        return Complaint.countDocuments(request)
    }

    updateComplaint(request, criteria) {
        return Complaint.findOneAndUpdate(request, criteria, { new: true }).populate({path:'customer',select:'name email mobile'});
    }

    deleteComplaint(request,id) {
        return Complaint.delete(request,id).populate({path:'customer',select:'name email mobile'});
    }
}

module.exports = new ComplaintService();