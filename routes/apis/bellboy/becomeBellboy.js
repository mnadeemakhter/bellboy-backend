const router = require("express").Router();
const ResponseService = require('../../../common/response')
const BellBoy = require("../../../models/becomeBellboyModel");
const { idValidator } = require("../../../common/idValidator");
const { sendMailSingleDevice } = require("../../../common/mail");
router.param("id", idValidator)
router.post("/", async (req, res, next) => {
    try {
        const bellboy = new BellBoy({
            name: req.body.name,
            email: req.body.email,
            contactNo: req.body.contactNo,
            description: req.body.description,
        });

        await bellboy.save();
        sendMailSingleDevice(bellboy.email, "No reply", `<div> Thanks for your interest, our team will contact you soon. </div>`)
        sendMailSingleDevice("hasnat@webfixinc.com", "New BellBoy Request", `<div>
            <p>email: ${bellboy.email}</p>
            <p>name: ${bellboy.name}</p>
            <p>contactNo: ${bellboy.contactNo}</p>
            <p>description: ${bellboy.description}</p>
        </div>`)
        return res.status(200).json({ success: true, data: { bellboy }, msg: "ok", status: 200 });
    } catch (error) {
        return res.status(400).json({ success: true, data: {}, msg: "Something Went Wrong", status: 400 });
    }
});
router.get("/", async (req, res, next) => {
    try {
        const bellboys = await BellBoy.find();
        return res.status(200).json({ success: true, data: { bellboys }, msg: "ok", status: 200 });
    } catch (error) {
        return res.status(400).json({ success: true, data: {}, msg: "Something Went Wrong", status: 400 });
    }
});
router.put("/:id", async (req, res, next) => {
    try {
        const bellboy = await BellBoy.findByIdAndUpdate(req.params.id, { $set: { active: false } }, { new: true })
        if (!bellboy) return res.status(404).json({ success: true, data: {}, msg: "not found", status: 404 })
        return res.status(200).json({ success: true, data: { bellboy }, msg: "ok", status: 200 });
    } catch (error) {
        // return res.status(500).send(ResponseService.failure(error))
        return res.status(400).json({ success: true, data: {}, msg: "Something Went Wrong", status: 400 });
    }
})

module.exports = router;