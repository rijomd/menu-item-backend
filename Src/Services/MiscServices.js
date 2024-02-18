const becrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto-js');

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
  generateUser: async (user) => {
    try {
      const encryptionKey = process.env.ENCRYPT_USER_KEY;
      const iv = process.env.INITIALIZATION_VECTOR;

      const { name, email, userRole, _id } = user;
      const selectedUser = { name, email, userRole, _id };

      const cipher = crypto.AES.encrypt(JSON.stringify(selectedUser), encryptionKey, { iv });
      return cipher.toString();
    } catch (error) {
      throw error
    }
  },
};

