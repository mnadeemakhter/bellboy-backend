const BellBoyService = require('../../services/bell-boy')
const CustomerService = require('../../services/customer')
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const DatabaseService = require('./../../common/push-notification')
const messages = require('../../common/messages')

const PushNotificationService = require('../../common/push-notification')

const LocalizationService = require('../../common/localization')
const LocaleService = require('../../services/locales')
const ChargesService = require('../../services/charges')
const HiringService = require('../../services/hirings')

const cryptoRandomString = require('crypto-random-string')
const hirings = require('../../services/hirings')

class UserController {
    async acceptHiring(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);

            if (!data.hiring) throw new apiErrors.ResourceNotFoundError('Hiring');


            // let hiring = await HiringService.getHiring({ _id: data.hiring, status: { $gt: 1, $lt: 3 }, is_completed: false });

            // if (hiring) return res.send(ResponseService.success({}, 'Already Assigned', false))


            // hiring = await HiringService.getHiring({ bellboy: user_id, _id: data.hiring, status: { $gte: 6 }, });

            // if (hiring) return res.send(ResponseService.success({}, 'No Operations can be perform', false))

            // hiring = await HiringService.getHiring({ _id: data.hiring });
            // hiring.bellboy = user_id;
            // hiring.start_time = Date.now();
            // hiring.status = 2;

            // await BellBoyService.updateBellboy({ busy_in: 2 }, { _id: user_id });

            // hiring = await hiring.save();
            let hiring = await HiringService.getHiring({ _id: data.hiring });

            // await PushNotificationService.notifySingleDevice({
            //     title: 'Hiring Recieved',
            //     body: 'BellBoy ' + hiring.bellboy.name + ' is at your service for ' + hiring.hours + ' hours',
            // }, hiring.customer.fcm_token, { _id: hiring._id.toString(), type: '2' });

            return res.send(ResponseService.success(hiring));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async getHirings(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.query);


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))


            // if (!data.type) throw new apiErrors.ValidationError('type', messages.TYPE_VALIDATION);


            let request = {
                status: { $gte: 4, $lte: 5 },
                bellboy: user_id
            };




            let total = await HiringService.HiringTotalCount(request)

            let hirings = await HiringService.getHiringsForCustomer(request)




            if (hirings.length != 0) {
                for (const hiring of hirings) {

                    hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
                }
            }



            return res.status(200).send(ResponseService.success({ hirings: hirings, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getHiringDetail(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.query);

            // if (!data.hiring_id) throw new apiErrors.ValidationError('hiring_id', messages.Hiring_ID_VALIDATION);


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))


            let hiring = await HiringService.getHiringDetailForBellBoy({ _id: data.hiring_id });

            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring Found', false));

            if (hiring.actions.length > 0) {
                hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            }

            return res.send(ResponseService.success(hiring));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async startTask(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            if (!data.hiring_id) throw new apiErrors.ValidationError('hiring_id', messages.HIRING_ID_VALIDATION);
            if (!data.action_id) throw new apiErrors.ValidationError('action_id', messages.ACTION_ID_VALIDATION);

            let hiring = await HiringService.getHiring({ _id: data.hiring_id });
            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring Found with this ID', false));

            hiring = await HiringService.getHiring({ bellboy: user_id, status: { $gte: 2, $lte: 5 }, _id: data.hiring_id, is_completed: false });
            if (!hiring) return res.send(ResponseService.success({}, 'No Active Hiring', false));


            let action = hiring.actions.id(data.action_id);
            let actions = hiring.actions;
            let actionProgress = action.progress;

            if (actionProgress >= 2) return res.send(ResponseService.success({}, 'You cannot perform any operation on this stage', false));

            let a = actions.filter(element => element.progress == 2);
           

            if (a.length > 0) return res.send(ResponseService.success({}, 'You are already busy in another task.', false));

            let b = actions.filter(element => element.progress >= 2);

            hiring.actions.id(data.action_id).progress = 2;
            hiring.actions.id(data.action_id).start_time = Date.now();

            if(b.length>0){
               
                hiring = await hiring.save();
                await PushNotificationService.notifySingleDevice({
                    title: 'Action ' + action.actionType.title + ' started!',
                    body: 'BellBoy ' + hiring.bellboy.name + ' has start the action ' + action.actionType.title,
                }, hiring.customer.fcm_token, { _id: hiring._id.toString(), type: '1' });
            }
            else{
               
                hiring.start_time = Date.now();
                hiring = await hiring.save();
                await PushNotificationService.notifySingleDevice({
                    title: 'Your Hiring Started with Action ' + action.actionType.title + ' started!',
                    body: 'BellBoy ' + hiring.bellboy.name + ' has start the action ' + action.actionType.title,
                }, hiring.customer.fcm_token, { _id: hiring._id.toString(), type: '1' });
            }

           
           
           
            return res.send(ResponseService.success(hiring, 'Task has been started', true));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async manageActionStatus(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            // if (!data.hiring_id) throw new apiErrors.ValidationError('hiring_id', messages.Hiring_ID_VALIDATION);


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))


            let hiring = await HiringService.getHiring({ _id: data.hiring_id });

            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring Found', false));
            hiring.actions.id(data.action_id).status = true;
            hiring.actions.id(data.action_id).progress = 3;
            hiring.actions.id(data.action_id).end_time = Date.now();
            //     hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            hiring = await hiring.save();
            let action = hiring.actions.id(data.action_id);
            await PushNotificationService.notifySingleDevice({
                title: 'Action ' + action.actionType.title + ' Done!',
                body: 'BellBoy ' + hiring.bellboy.name + ' has completed the action',
            }, hiring.customer.fcm_token, { _id: hiring._id.toString(), type: '1' });
            return res.send(ResponseService.success(hiring));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async cancelTask(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            if (!data.hiring_id) throw new apiErrors.ValidationError('hiring_id', messages.HIRING_ID_VALIDATION);
            if (!data.action_id) throw new apiErrors.ValidationError('action_id', messages.ACTION_ID_VALIDATION);

            let hiring = await HiringService.getHiring({ _id: data.hiring_id });
            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring Found with this ID', false));

            hiring = await HiringService.getHiring({ bellboy: user_id, status: { $gte: 2, $lte: 5 }, _id: data.hiring_id, is_completed: false });
            if (!hiring) return res.send(ResponseService.success({}, 'No Active Hiring', false));

            if (!(hiring.actions.id(data.action_id).progress == 2))
                return res.send(ResponseService.success({}, 'Action camnot be cancelled at this stage!', false))


            let action = hiring.actions.id(data.action_id);
            let actions = hirings.actions;
            let actionProgress = action.progress;

            if (actionProgress != 2) return res.send(ResponseService.success({}, 'You cannot perform any operation on this stage', false));

            let a = actions.filter(element => element.progress < 2 && element.progress > 2);

            if (a.length > 0) return res.send(ResponseService.success({}, 'You cannot perform any operation on this stage', false));


            hiring.actions.id(data.action_id).progress = 4;
            hiring.actions.id(data.action_id).end_time = Date.now();
            hiring = await hiring.save();
            await PushNotificationService.notifySingleDevice({
                title: 'Action ' + action.actionType.title + ' cancelled!',
                body: 'BellBoy ' + hiring.bellboy.name + ' has cancelled the action ' + action.actionType.title,
            }, hiring.customer.fcm_token, { _id: hiring._id.toString(), type: '1' });
            return res.send(ResponseService.success(hiring, 'Task has been cancelled', true));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async manageActionCancellationStatus(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            let hiring = await HiringService.getHiring({ _id: data.hiring_id });

            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring Found', false));


            hiring.actions.id(data.action_id).status = true;
            hiring.actions.id(data.action_id).isCancelled = true;
            hiring.actions.id(data.action_id).cancelledBy = 2;
            hiring.actions.id(data.action_id).progress = 4;
            hiring.actions.id(data.action_id).cancellationReason = data.cancellationReason;
            //     hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            hiring = await hiring.save();
            let action = hiring.actions.id(data.action_id);
            await PushNotificationService.notifySingleDevice({
                title: 'Action ' + action.actionType.title + ' Cancelled!',
                body: 'BellBoy ' + hiring.bellboy.name + ' has cancelled the action',
            }, hiring.customer.fcm_token, { _id: hiring._id.toString(), type: '1' });
            return res.send(ResponseService.success(hiring));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async manageHiringStatus(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            let hiring = await HiringService.getHiring({ bellboy: user_id, status: { $gte: 2, $lte: 5 }, _id: data.hiring_id, is_completed: false });
            if (!hiring) return res.send(ResponseService.success({}, 'No Active Hiring', false));

            let notificationMessage = {};
            let security_code;
            hiring.status = hiring.status + 1;
            const isFree=await HiringService.getHiring({customer:hiring.customer._id,status:4})
            
            // if (hiring.status == 3) {
            if (hiring.status == 3) {
                let records = await DatabaseService.getRecordsForHiring(hiring._id.toString());
                let charges = await ChargesService.getCharges({ 'service_type': 2 });
                let fuelCharges = 0.0;
                let serviceCharges = 0.0;
                let timeCosting = 0.0;
                let waitingCharges = 0.0;

                let end_time = Date.now();
                hiring.end_time = end_time;
                let firstDate = end_time;
                let secondDate = new Date(hiring.start_time);

                var difference = firstDate - secondDate.getTime();
                var totalMins = difference / 1000 / 60;
                var totalTime = Math.floor(totalMins);
                // below formula is created By Daniyal
                // totalTime = totalTime > hiring.hours ? totalTime : hiring.hours;

                // below formula is created By Usman 
                totalTime=Math.round(((end_time-hiring.start_time)/1000)/60);
                var totalHours = totalMins / 60;
                var minutes = totalTime - (Math.floor(totalHours)) * 60;

                var billingTime = Math.floor(totalHours);
                var graceTime = minutes;
                difference -= totalTime * 1000 * 60;


                // if (graceTime > 30) {
                //     billingTime = billingTime + 1;
                //     graceTime = 0.0;
                // }
                // if (hiring.hours > billingTime) {
                //     billingTime = hiring.hours;
                //     graceTime = 0.0;
                // }

                charges.forEach(element => {
                    switch (element.charges_type) {
                        case 1:
                            serviceCharges = element.value;
                            break;
                        case 2:
                            fuelCharges = element.value;
                            break;
                        case 3:
                            timeCosting = element.value;
                            break;
                        case 4:
                            waitingCharges = element.value;
                            break;
                    }
                });
                let customer = await CustomerService.getCustomer({ _id: hiring.customer._id });

                // Daniyal total Bill Formula;
                // let totalBill = (fuelCharges * records.distance) + (timeCosting * totalTime) + 0.0 + 0.0;
                
                // Usman Formula
                let totalBill=Number(totalTime<30?30:totalTime)*5;
                let paidByWallet = 0.0;
                let actualBill = totalBill;
                // if (customer) {
                //     if (customer.wallet > 0) {
                //         // totalBill = totalBill - customer.wallet;
                //         // paidByWallet = actualBill - totalBill;
                //         // customer.wallet = customer.wallet - paidByWallet;

                //         customer.wallet = customer.wallet - paidByWallet;
                //         await customer.save();
                //     }
                // }
                let costing = {
                    totalDistance: records.distance,
                    totalTime: totalTime,
                    billingTime: totalTime,
                    graceTime: 0.0,
                    hours: Math.floor(totalHours),
                    minutes: minutes,
                    fuelCharges: {
                        calculated: fuelCharges * records.distance,
                        defined: fuelCharges
                    },
                    serviceCharges: {
                        calculated: serviceCharges,
                        defined: serviceCharges,
                    },
                    timeCosting: {
                        calculated: timeCosting * totalTime,
                        defined: timeCosting
                    },
                    waitingCharges: {
                        calculated: 0.0,
                        defined: waitingCharges
                    },
                    totalBill: totalBill,
                    paidByWallet: paidByWallet,
                }

                hiring.charges = costing;
                hiring.amount = totalBill;
                if(isFree){
                    hiring.isFree=false;
                }else{
                    hiring.isFree=true;
                }
                console.log("hiring.isFree=>>",hiring.isFree);
                hiring = await hiring.save();
                hiring = await HiringService.getHiring({ bellboy: user_id, _id: data.hiring_id, });

                notificationMessage = {
                    title: 'Pay Bill',
                    body: 'Please pay the bill ' + totalBill + ' PKR to BellBoy ' + hiring.bellboy.name + ' for ' + totalTime + ' mins !',
                };
                await PushNotificationService.notifySingleDevice(
                    notificationMessage,
                    hiring.customer.fcm_token,
                    {
                        _id: hiring._id.toString(),
                        type: '1',
                    }
                );
            }

            else if (hiring.status == 4) {
                while (1) {
                    var first = cryptoRandomString({ length: 2, type: 'distinguishable' });
                    var second = cryptoRandomString({ length: 4, type: 'numeric' });
                    security_code = first + second;
                    hiring = await HiringService.getHiringSimply({ security_code: security_code })
                    if (!hiring) break;
                    else continue;

                }

                hiring = await HiringService.getHiring({ bellboy: user_id, _id: data.hiring_id, });

                hiring.security_code = security_code.toLowerCase();

                hiring.for_verification = true;
                hiring = await hiring.save();
                hiring = await HiringService.getHiring({ bellboy: user_id, _id: data.hiring_id, });
                notificationMessage = {
                    title: 'Thanks for using BellBoy!',
                    body: 'Kindly close the hiring.',
                };
                await PushNotificationService.notifySingleDevice(
                    notificationMessage,
                    hiring.customer.fcm_token,
                    {
                        _id: hiring._id.toString(),
                        type: '2',
                        security_code: security_code.toUpperCase()
                    }
                );


            }


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))

            if (hiring.actions.length > 0) {
                hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            }


            return res.send(ResponseService.success(hiring));
        } catch (error) {
            console.log(error)
            res.send(ResponseService.failure(error));
        }
    }

    async verifyCode(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            let hiring = await HiringService.getHiring({ bellboy: user_id, _id: data.hiring_id, });
            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring', false));

            let checkCode = await HiringService.getHiringSimply({
                security_code: data.security_code.toLowerCase(),
                _id: data.hiring_id,
            });

            if (checkCode) {

                hiring.is_completed = true;
                hiring.status = 4;
                await hiring.save();
                await BellBoyService.updateBellboy({ busy_in: 0, is_busy: false }, { _id: user_id });

                return res.send(ResponseService.success({}, 'Thanks for verification', true));
            }
            else {
                return res.send(ResponseService.success({}, 'Invalid Confirmation Code', false));
            }


        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async addBillImage(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.hiring) throw new apiErrors.ValidationError('hiring', messages.ID_VALIDATION);
            if (!data.action) throw new apiErrors.ValidationError('action', messages.ID_VALIDATION);

            if (!req.file) throw new apiErrors.ValidationError('image', messages.IMAGE_VALIDATION);
            let hiring = await HiringService.getHiring({ _id: data.hiring });
            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring Found', false));
            let image;
            if (req.file) {
                // image = req.file.destination + '/' + req.file.filename;
                image = req.file.key;

                hiring.actions.id(data.action).bill_images.push(image);
                hiring = await hiring.save();
            }


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))
            if (hiring.actions.length > 0) {
                hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            }
            return res.send(ResponseService.success(hiring));


        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async removeBillImage(req, res) {
        try {
            let data = Object.assign({}, req.body);

            if (!data.hiring) throw new apiErrors.ValidationError('hiring', messages.ID_VALIDATION);
            if (!data.action) throw new apiErrors.ValidationError('action', messages.ID_VALIDATION);
            let hiring = await HiringService.getHiring({ _id: data.hiring });
            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring Found', false));
            hiring.actions.id(data.action).bill_images.pull(data.bill);
            hiring = await hiring.save();
            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))
            if (hiring.actions.length > 0) {
                hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            }

            return res.send(ResponseService.success(hiring));


        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    // async getHirings(req, res) {
    //     try {
    //         const user_id = req._user_info._user_id;
    //         let data = Object.assign({}, req.query);


    //         let code = data.locale || 'en';

    //         let locale = await LocaleService.getLocale({ code: code });
    //         if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))


    //         let request = {};
    //         request = {
    //             status: { $gte: 6, $lte: 7 },
    //             bellboy: user_id
    //         };





    //         let Hirings = await HiringService.getHiringsForBellBoy(request)


    //         if (Hirings.length == 0) return res.status(200).send(ResponseService.success({ Hirings: [], count: 0 }, 'No Hiring Found', false))

    //         let total = Hirings.length;

    //         for (const Hiring of Hirings) {

    //             Hiring.category = LocalizationService.getLabels([Hiring.category], 'en')[0];
    //         }


    //         return res.status(200).send(ResponseService.success({ Hirings: Hirings, count: total }))

    //     }
    //     catch (error) {
    //         return res.status(500).send(ResponseService.failure(error))
    //     }

    // }
}

module.exports = new UserController();