const ActionTypeService = require('../../services/hiring-action-type')
const HiringCartService = require('../../services/hiring-cart')
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')
const LocalizationService = require('../../common/localization')


class HiringCartController {

    async getHiringCart(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let hiringCart = await HiringCartService.getHiringCart({ customer: user_id });
            if (!hiringCart) return res.send(ResponseService.success({}, 'No hiring cart', false));

            if (hiringCart.actions.length > 0) {
                hiringCart.actions = LocalizationService.getLabelForHiringCart(hiringCart.actions, 'en');
            }
            return res.send(ResponseService.success(hiringCart));
        } catch (error) {
            return res.send(ResponseService.failure(error));
        }
    }

    async addToHiringCart(req, res) {
        try {

            const user_id = req._user_info._user_id;

            var data = Object.assign({}, req.body);

            if (!data.actionType) throw new apiErrors.ValidationError('actionType', messages.HIRING_ACTION_TYPE_VALIDATION);

            let isActive = await ActionTypeService.isActive({ _id: data.actionType });
            if (!isActive) throw new apiErrors.InActiveError('actionType');


            //   if (!data.instruction) throw new apiErrors.ValidationError('instruction', 'Instruction not found');



            let images = Array();
            if (req.files) {
                console.table(req.files)
                if (req.files['images']) {
                    req.files['images'].forEach(element => {
                        let image = element.key;// + '/' + element.filename;
                        images.push(image);
                    });
                    data.images = images;
                }
                if (req.files['voiceNote']) {
                    req.files['voiceNote'].forEach(element => {
                        let voiceNote = element.key;// + '/' + element.filename;
                        data.voice_note = {
                            value: voiceNote,
                            exists: true
                        };
                    });

                }
            }




            data.location = {
                address: data.address,
                near_by: data.near_by,
                geolocation: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                }
            }

            let HiringCart = await HiringCartService.getHiringCart({ customer: user_id });
            let updatedHiringCart;
            let HiringCartData;
            if (!HiringCart) {
                HiringCartData = {
                    customer: user_id,
                    actions: [data],
                    totalActions: 1
                }
                updatedHiringCart = await HiringCartService.createHiringCart(HiringCartData);
            }
            else {
                HiringCart.actions.push(data);
                HiringCart.totalActions = HiringCart.totalActions + 1;
                updatedHiringCart = await HiringCart.save();

            }

            let hiringCart = await HiringCartService.getHiringCart({ customer: user_id });
            if (!hiringCart) res.send(ResponseService.success({}, 'No hiring cart', false));

            if (hiringCart.actions.length > 0) {
                hiringCart.actions = LocalizationService.getLabelForHiringCart(hiringCart.actions, 'en');
            }


            return res.send(ResponseService.success(hiringCart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async addVoiceNote(req, res) {
        try {

            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);

            let voice_note;
            console.log(req.file)
            if (req.file) {
                // voice_note = req.file.destination + '/' + req.file.filename;
                voice_note = req.file.key;

                data.voice_note = {
                    value: voice_note,
                    exists: true
                }
            }
            else {
                voice_note = '';
                data.voice_note = {
                    value: voice_note,
                    exists: false
                }
            }


            let HiringCart = await HiringCartService.getHiringCart({ customer: user_id });
            let updatedHiringCart;
            let HiringCartData;
            if (!HiringCart) {
                HiringCartData = {
                    customer: user_id,
                }
                HiringCart = await HiringCartService.createHiringCart(HiringCartData);
            }

            HiringCart.voice_note = data.voice_note;
            updatedHiringCart = await HiringCart.save();




            return res.send(ResponseService.success(updatedHiringCart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async removeVoiceNote(req, res) {
        try {

            const user_id = req._user_info._user_id;

            let HiringCart = await HiringCartService.getHiringCart({ customer: user_id });
            let updatedHiringCart;
            if (!HiringCart) throw new apiErrors.NotFoundError('HiringCart', 'No HiringCart Found')
            if (!HiringCart.voice_note.exists) throw new apiErrors.NotFoundError('voice_note', 'No Voice Note Found')

            HiringCart.voice_note = {
                value: '',
                exists: false
            };
            updatedHiringCart = await HiringCart.save();


            return res.send(ResponseService.success(updatedHiringCart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async removeFromHiringCart(req, res) {
        try {

            const user_id = req._user_info._user_id;

            var data = Object.assign({}, req.body);
            let HiringCart = await HiringCartService.getHiringCartSimply({ customer: user_id });
            if (!HiringCart) throw new apiErrors.ResourceNotFoundError('HiringCart', 'No HiringCart exists');
            if (!data.action) throw new apiErrors.ValidationError('action', 'Action ID Required');




            let updatedHiringCart = await HiringCartService.updateHiringCart({ customer: user_id }, { $pull: { actions: { _id: data.action } }, totalActions: HiringCart.totalActions - 1 });



            return res.send(ResponseService.success(updatedHiringCart));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async deleteCart(req, res) {
        try {

            const user_id = req._user_info._user_id;

            await HiringCartService.deleteHiringCart({ customer: user_id });



            return res.send(ResponseService.success({}, 'Cart has beend deleted', true));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new HiringCartController();