const Charges = require('./../models/charges')
const BellBoyType = require('./../models/bellboy-type')

class ChargesService {
    addCharges(request) {
        return new Charges(request).save();
    }

    getCharges(request) {
        return Charges.find(request).populate(
            {
                path: 'bellboy_type',
                populate: [
                    { path: 'locales' },
                    { path: 'labels', populate: { path: 'locale' } },
                ],
                select: '-created_at -updated_at'
            }
        );
    }

    getCharge(request) {
        return Charges.findOne(request).populate(
            {
                path: 'bellboy_type',
                populate: [
                    { path: 'locales' },
                    { path: 'labels', populate: { path: 'locale' } },
                ],
                select: '-created_at -updated_at'
            }
        );
    }

    ChargesTotalCount(request) {
        return Charges.countDocuments(request);
    }

    updateCharges(request, criteria) {
        return Charges.findOneAndUpdate(request, criteria, { new: true }).populate(
            {
                path: 'bellboy_type',
                populate: [
                    { path: 'locales' },
                    { path: 'labels', populate: { path: 'locale' } },
                ],
                select: '-created_at -updated_at'
            }
        );
    }

    deleteCharges(request) {
        return Charges.findOneAndDelete(request).populate(
            {
                path: 'bellboy_type',
                populate: [
                    { path: 'locales' },
                    { path: 'labels', populate: { path: 'locale' } },
                ],
                select: '-created_at -updated_at'
            }
        );
    }

    async aggregateCharges(request) {
        let charges = await Charges.aggregate(
            [
                {
                    "$match": { "service_type": request, "status": true }
                },
                {
                    "$group":
                    {
                        "_id": "$charges_type",
                        "charges": {
                            "$addToSet": {
                                "_id": "$_id",
                                "value": "$value",
                                "bellboy_type": "$bellboy_type",
                                "status": "$status",
                                "service_type": "$service_type",

                            }
                        }

                    }
                },
                {
                    "$project": {
                        "charges_type": "$_id",
                        "_id": 0,
                        "charges": 1
                    }
                }
            ]);
        return this.populateBellBoyType(charges);
    }

    async aggregateChargesByBellBoyType(request) {
        let charges = await Charges.aggregate(
            [
                {
                    "$match": { "service_type": request, "status": true }
                },
                {
                    "$group":
                    {
                        "_id": "$bellboy_type",
                        "charges": {
                            "$addToSet": {
                                "_id": "$_id",
                                "value": "$value",
                                "charges_type": "$charges_type",
                                "status": "$status",
                                "service_type": "$service_type",

                            }
                        }

                    }
                },
                {
                    "$project": {
                        "bellboy_type": "$_id",
                        "_id": 0,
                        "charges": 1
                    }
                }
            ]);
        return this.populateBellBoyTypeFor(charges);
    }

    populateBellBoyType(request) {
        return BellBoyType.populate(request, {
            path: 'charges.bellboy_type',
            populate: [
                { path: 'locales' },
                { path: 'labels', populate: { path: 'locale' } },
            ],
            select: '-created_at -updated_at'
        });
    }

    populateBellBoyTypeFor(request) {
        return BellBoyType.populate(request, {
            path: 'bellboy_type',
            populate: [
                { path: 'locales' },
                { path: 'labels', populate: { path: 'locale' } },
            ],
            select: '-created_at -updated_at'
        });
    }


    getChargesCollection(charges) {
        //  console.log(charges);
        let newCharges = {
            minmum_charges: 0,
            maximum_charges: 0
        };

        charges.forEach(charge => {

            if (charge.charges_type == 1) {
                newCharges.minmum_charges = newCharges.minmum_charges + charge.value;
                newCharges.maximum_charges = newCharges.maximum_charges + charge.value;

            }
            else if (charge.charges_type == 2) {
                newCharges.minmum_charges = newCharges.minmum_charges + charge.value;
                newCharges.maximum_charges = newCharges.maximum_charges + charge.value * 2;
            }
            else if (charge.charges_type == 3) {
                newCharges.minmum_charges = newCharges.minmum_charges + charge.value * 20;
                newCharges.maximum_charges = newCharges.maximum_charges + (charge.value * 40);
            }
            else if (charge.charges_type == 4) {
                newCharges.minmum_charges = newCharges.minmum_charges + charge.value;
                newCharges.maximum_charges = newCharges.maximum_charges + charge.value;
            }


        });


    //    console.log(minmum_charges);
        return newCharges;
    }

    getHiringChargesCollection(charges) {
        //  console.log(charges);
       let newCharges =  {};

        charges.forEach(charge => {

           if (charge.charges_type == 3) {
              newCharges = charge;
            }
          


        });


    //    console.log(minmum_charges);
        return newCharges;
    }
}

module.exports = new ChargesService();