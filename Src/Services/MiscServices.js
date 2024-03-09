const becrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require('crypto-js');

module.exports = {
  encryptPassword: (string) => {
    return becrypt.hash(string, 10);
  },
  verifyPassword: (password, Password) => {
    return new Promise((resolve, reject) => {
      becrypt.compare(password, Password).then((status) => {
        status ? resolve(true) : reject({ error: "invalid email or password" });
      });
    });
  },
  generateToken: (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  },
  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  },

  response: (error_code, message, data) => {
    return {
      status_code: error_code,
      message: message,
      data: data
    }
  },
  generateUser: (user) => {
    try {
      const secret_key = "RIJO-MENU-ENCRYPTION-PURPOSE";
      const { name, email, userRole, _id, location } = user;
      const selectedUser = {
        name, email, userRole, _id,
        location: location._id?.toString() || "", locationName: location?.name,
      };
      console.log(selectedUser, 'selectedUser');
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(selectedUser), secret_key).toString();
      return encryptedData;
    } catch (error) {
      throw error
    }
  },
  deCryptQuery: (user) => {
    const secret_key = "RIJO-MENU-ENCRYPTION-PURPOSE";
    try {
      const bytes = CryptoJS.AES.decrypt(user, secret_key);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedData) {
        throw new Error('Decrypted data is empty');
      }
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null; // or handle the error in another way
    }
  },
};

