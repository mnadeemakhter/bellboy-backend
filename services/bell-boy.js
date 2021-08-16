const Bellboy = require('../models/bellboys')
const messages = require('../common/messages')
class BellboyService {
    getBellboy(request) {
        return Bellboy.findOne(request).populate({
            path: 'bellboyType',
            select: 'title icon'
        });
    }
    updateBellboyLastSeen(request) {
        return Bellboy.updateOne(request,{last_seen:Date.now()});
    }
    getBellboyForDashboard(request) {
        return Bellboy.findOne(request).select('name avatar _id mobile email status working_status is_busy');
    }
    getBellboys(request, perPage, pageNo,sortBy) {
        return Bellboy.find(request).populate({
            path: 'bellboyType',
            select: 'title icon'
        }).skip((pageNo - 1) * perPage).limit(perPage).sort(sortBy);

    }

    getBellboysForAdmin(request) {
        return Bellboy.find(request).select('_id name mobile avatar email bellboyType fcm_token').populate({
            path: 'bellboyType',
            select: 'title icon'
        });

    }

    getBellboysSimply(request) {
        return Bellboy.find(request);

    }
    getBellboySimply(request) {
        return Bellboy.findOne(request);

    }
    bellboyTotalCount(request) {
        return Bellboy.countDocuments(request)
    }
    createBellboy(request) {
        return new Bellboy(request).save();
    }
    updateBellboy(details, criteria) {
        return Bellboy.findOneAndUpdate(criteria, details, { new: true }).populate({
            path: 'bellboyType',
            select: 'title icon'
        });
    }
    deleteBellboy(criteria) {
        return Bellboy.findOneAndDelete(criteria).populate({
            path: 'bellboyType',
            select: 'title icon'
        });
    }
    countBellBoyForAdminDashboard(start, end) {
        return Bellboy.aggregate(
            [
                {
                    '$match': {
                        '$and': [
                            { 'created_at': { '$gt': start, '$lt': end } },
                        ]
                    }
                },
                { '$sort': { 'created_at': -1 } },
                {
                    '$group':
                    {
                        '_id':
                        {
                            day: { $dayOfMonth: "$created_at" },
                            month: { $month: "$created_at" },
                            year: { $year: "$created_at" }
                        },
                        count: { $sum: 1 },
                        date: { $first: "$created_at" }
                    }
                },
                {
                    $project:
                    {
                        formattedDate:
                        {
                            $dateToString: { format: "%Y-%m-%d", date: "$date" }
                        },
                        date: '$_id',
                        count: 1,
                        _id: 0
                    }
                }
            ])
    }
    getBellBoyWithDateRange(start, end) {
        return Bellboy.aggregate(
            [
                {
                    '$match': {
                        '$and': [
                            { 'created_at': { '$gt': start, '$lt': end } },
                        ]
                    }
                },
                { '$sort': { 'created_at': -1 } },

            ])
    }
}

module.exports = new BellboyService();