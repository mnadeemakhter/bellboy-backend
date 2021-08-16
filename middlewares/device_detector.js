
const DeviceDetector = require("node-device-detector");
const deviceDetector = new DeviceDetector;
exports.deviceDetector = (req, res, next) => {
    const useragent = req.headers['user-agent'];
    req.useragent = useragent;
    req.device = deviceDetector.detect(useragent);
    next();
}