const Label = require('./../models/labels')

class LabelService {
    addLabel(request) {
        return new Label(request).save();
    }

    getLabels(request) {
        return Label.find(request);
    }

    getLabel(request) {
        return Label.findOne(request);
    }

    LabelTotalCount(request) {
        return Label.countDocuments(request)
    }

    updateLabel(request, criteria) {
        return Label.findOneAndUpdate(request, criteria, { new: true });
    }

    deleteLabel(request) {
        return Label.findOneAndDelete(request);
    }
}

module.exports = new LabelService();