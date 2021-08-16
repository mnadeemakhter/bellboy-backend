const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'IMAP Mail Server',
    host: "webfixinc.com",
    security: true,
    port: 465,
    auth: {
        user: "no-reply@mazito.io",
        pass: "webfix129"
    }
});
exports.sendMailSingleDevice = (to, subject, html) => {
    const mailOptions = {
        from: "no-reply@mazito.io",
        to,
        subject,
        html
    };
    transporter.sendMail(mailOptions, function (error, info) {
        console.log("info => ", info);
    });
}

