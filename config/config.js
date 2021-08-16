require("dotenv").config()
module.exports = {
    hostname:'localhost',
    // 
    port:3000,
    local_database:"mongodb://localhost/bellboy",
    server_database:process.env.SERVER_DB,
    googleMapApiKey:process.env.GOOGLE_MAP_API_KEY
}