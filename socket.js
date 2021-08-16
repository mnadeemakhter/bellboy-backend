const Usersdata = require("./users");

const path = require("path").resolve;
const config = require(path("config/constants"));
const jsonwebtoken = require("jsonwebtoken");

const BellboyactivityService = require("./services/bellboyactivity");
const CustomeractivityService = require("./services/customeractivity");
const AdminactivityService = require("./services/adminactivity");
const BellBoyService = require("./services/bell-boy");
const AuthController = require("./controllers/common/auth");
const AuthService = require("./services/auth");
const mainSockets = (io) => {
  io.use(async (socket, next) => {
    try {
      console.log("middleware [socket.js]");
      console.log(socket.handshake.query);
      const token = socket.handshake.query.token
        ? socket.handshake.query.token.split(" ")[1]
        : "";
      if (!token) {
        socket.logedin = false;
        return ;
      }
      {
        const decode = jsonwebtoken.verify(token, config.authSecretToken);
        let bellBoy = await BellBoyService.getBellboy({ _id: decode.id });
        if (!bellBoy) return;

        const user = {
          _user_id: decode.id || undefined,
          _user_type: decode.type || undefined,
          mobile: bellBoy.mobile,
        };
        socket._user_info = user;
        socket.logedin = true;

        console.log("1Authenticated...");
        return next();
      }
    } catch (error) {
      return;
    }
  });

  io.on("connection", function (socket) {
    console.log("new connection [socket.js]=>", socket.id);
    if (socket._user_info) {
      if (!Usersdata.findUser(socket._user_info._user_id)) {
        // socket.emit("login_response", {
        //   status: 200,
        //   msg: "",
        //   alreadyLogedIn: false,
        // });
        Usersdata.addUser(
          {
            socketId: socket.id,
            _id: socket._user_info._user_id,
            type: socket._user_info._user_type || 0,
            mobile: socket._user_info.mobile,
            start: new Date(),
          },
          () => {
            console.log("from cb");
            io.emit("users", { users: Usersdata.getAllUser() });
          }
        );
      } else {
        // socket.emit("login_response", {
        //   status: 400,
        //   msg: "BellBoy already logedin from another device",
        //   alreadyLogedIn: true,
        // });
      }
    }

    // socket.on("bellboy_login", async (data) => {
    //   console.log("[bellboy] data [socket.js]=> ", data);
    //   if (Usersdata.findUserBySocketId(socket.id)) {
    //     socket.emit("login_response", {
    //       status: 200,
    //       msg: "", 
    //       alreadyLogedIn: false,
    //     });
    //   } else {
    //     let request = data;
    //     let bellBoy = await BellBoyService.getBellboy({
    //       mobile: request.mobile,
    //     });
    //     if (!bellBoy) {
    //       socket.emit("login_response", {
    //         status: 404,
    //         msg: "BellBoy Not Found",
    //         alreadyLogedIn: true,
    //       });
    //     } else {
    //       socket.logedin = true;
    //       if (Usersdata.findUser(bellBoy._id)) {
    //         socket.emit("login_response", {
    //           status: 400,
    //           msg: "BellBoy already logedin from another device",
    //           alreadyLogedIn: true,
    //         });
    //       } else {
    //         Usersdata.addUser(
    //           {
    //             socketId: socket.id,
    //             _id: bellBoy._id,
    //             type: 2,
    //             start: new Date(),
    //             mobile: bellBoy.mobile,
    //           },
    //           () => {
    //             io.emit("users", { users: Usersdata.getAllUser() });
    //           }
    //         );
    //         socket.emit("login_response", {
    //           status: 200,
    //           msg: "",
    //           // bellBoy: udpateBellBoy,
    //           alreadyLogedIn: false,
    //         });
    //       }
    //     }
    //   }
    // });

    socket.on("bellboy_logout", async () => {
      const removedUser = Usersdata.removeUser(socket.id);
      console.log("logout [socket.js]",socket.id);
      console.log("removedUser [socket.js]=>", removedUser);
      if (removedUser) {
        if (removedUser.type === 1) {
          await AdminactivityService.main(removedUser);
        } else if (removedUser.type === 2) {
          await BellboyactivityService.main(removedUser);
        } else if (removedUser.type === 3) {
          await CustomeractivityService.main(removedUser);
        }
      }
      io.emit("users", { users: Usersdata.getAllUser() });
    });
    socket.on("disconnect", async function () {
      // there is type error in below code
      //    users=users.filter(u=>u.socketId!==socket.id);
      console.log("disconnecttion [socket.js]=>", socket.id);
      const removedUser = Usersdata.removeUser(socket.id);
      console.log("removedUser [socket.js]=>", removedUser);
      if (removedUser) {
        if (removedUser.type === 1) {
          await AdminactivityService.main(removedUser);
        } else if (removedUser.type === 2) {
          await BellboyactivityService.main(removedUser);
        } else if (removedUser.type === 3) {
          await CustomeractivityService.main(removedUser);
        }
      }
      io.emit("users", { users: Usersdata.getAllUser() });
    });
  });
};
module.exports = mainSockets;
