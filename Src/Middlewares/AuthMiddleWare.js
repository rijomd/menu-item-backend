const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path');

const MiscServices = require("../Services/MiscServices");
const UserService = require("../Services/UserService");

module.exports = {
  // for other operations
  verifyUser: async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = await MiscServices.verifyToken(token);
        let user = await UserService.getUserByid(decoded.id)
        if (user && user.status === 'Active') {
          req.user = user;
          req.user.token = token
        }
        next();
      } catch (error) {
        console.log(error, "error");
        res.status(401).json(MiscServices.response(401, process.env.UN_AUTHORIZED, {}));
      }
    } else {
      res.status(401).json(MiscServices.response(401, process.env.UN_AUTHORIZED, {}));
    }
  },

  // for chat
  AutherizedUser: async (socket, next) => {
    const token = socket.handshake?.headers?.["my-token"]?.split(" ")[1];
    if (!token) {
      next(new Error("unauthorized event"));
    }
    else {
      const decoded = await MiscServices.verifyToken(token);
      let user = await UserService.getUserByid(decoded.id)
      if (user) {
        socket.user = user;
        socket.user.token = token
      }
      next();
    }
  },

  deCryptQuery: async (req, res, next) => {
    const secret_key = "RIJO-MENU-ENCRYPTION-PURPOSE";
    const requestData = req.body.encryptedCredentials 
    if (requestData) {
      try {
        const bytes = CryptoJS.AES.decrypt(requestData, secret_key);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedData) {
          throw new Error('Decrypted data is empty');
        }
        let data = JSON.parse(decryptedData);
        if (req.file?.filename) {
          data = { ...data, file: req.file?.filename }
        }
        req.body = data;
        next();
      } catch (error) {
        console.log(error);
        res.status(401).json(MiscServices.response(401, process.env.UN_AUTHORIZED, {}));
      }
    }
    else{
      res.status(401).json(MiscServices.response(401, process.env.UN_AUTHORIZED, {}));
    }
  },

}