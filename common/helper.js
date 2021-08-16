const mongoose = require('mongoose')

class Helper {
    isValidMongoID(str) {
        return mongoose.Types.ObjectId.isValid(str);
    }
    paginate(array, page_number, page_size) {
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }
    startAndEndOfWeek(date) {

        // If no date object supplied, use current date
        // Copy date so don't modify supplied date
        var now = date ? new Date(date) : new Date();

        // set time to some convenient value
        now.setHours(0, 0, 0, 0);

        // Get the previous Monday
        var monday = new Date(now);
        monday.setDate(monday.getDate() - monday.getDay() + 1);

        // Get next Sunday
        var sunday = new Date(now);
        sunday.setDate(sunday.getDate() - sunday.getDay() + 7);

        // Return array of date objects
        return [monday, sunday];
    }
    startAndEndOfMonth() {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth() - 1;
        var firstDay = new Date(y, m, 2);
        var lastDay = new Date(y, m + 1, 1);
        return [firstDay, lastDay];
    }

    startAndEndOfYear(date) {
        var d = new Date(), y = d.getFullYear(), m = d.getMonth();
        var lastDayIndex = new Date(y, 12, 1).getDate();
        var firstDay = new Date(y, 0, 2);
        var lastDay = new Date(y, 12, lastDayIndex);
        return [firstDay, lastDay];
    }

    async getTransactions(hirings) {
        let transactions = [];
        let totalSpend = 0.0;
        let count = 0;
        if (hirings.length > 0) {
            hirings.forEach(hiring => {
                let transaction = {
                    totalActions: hiring.actions.length,
                    totalBill: hiring.charges.totalBill,
                    paidByWallet: hiring.charges.paidByWallet,
                    hours: hiring.hours,
                    created_at: hiring.created_at,
                    end_time: hiring.end_time,
                }
                totalSpend += hiring.charges.totalBill + hiring.charges.paidByWallet;
                transactions.push(transaction);
            });
            count = hirings.length;
        }

        return { transactions, totalSpend, count };
    }

}

module.exports = new Helper();