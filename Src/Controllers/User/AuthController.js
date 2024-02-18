const UserService = require("../../Services/UserService");
const MiscService = require("../../Services/MiscServices");

const checkExisting = async (user) => {
  user.password = await MiscService.encryptPassword(user.password);
  const newUser = await UserService.createUser(user);
  const token = MiscService.generateToken(user._id);
  return { newUser, token };
}


module.exports = {

  doSignup: async (req, res, next) => {
    let user = req.body;
    try {
      let exist = await UserService.getUser(user.email);
      if (exist) {
        res.status(400).json(MiscService.response(400, process.env.ALREADY_EXIST, {}))
      }
      else {
        const data = await checkExisting(user);
        res.status(201)
          .json(MiscService.response(200, process.env.SUCCESS, { token: data.token, user: { email: data?.newUser?.email } }));
      }
    } catch (error) {
      console.log(error)
      res.status(400).json(MiscService.response(400, error.error || process.env.WRONG_SOMETHING, {}));
    }
  },

  doLogin: async (req, res) => {
    let user = req.body;
    try {
      let User = await UserService.getUser(user.email);
      if (User) {
        (passwordVerification = await MiscService.verifyPassword(user.password, User.password)),
          (token = MiscService.generateToken(User._id)),
          (selectedItemUser = await MiscService.generateUser(User)),
          res.status(200).json(MiscService.response(200, process.env.SUCCESS, { token, selectedItemUser }))
      }
      else {
        res.status(400).json(MiscService.response(400, process.env.NO_USER_FOUND, {}));
      }
    } catch (error) {
      console.log(error)
      res.status(400).json(MiscService.response(400, error.error || process.env.WRONG_SOMETHING, {}));
    }
  },

  doActivateAdmin: async (req, res) => {
    try {
      const userAdmin = {
        name: "Admin",
        userRole: "admin",
        email: "Admin@gmail.com",
        status: "active",
        password: "Admin@7034"
      }
      let exist = await UserService.getUser(userAdmin.email);
      if (exist) {
        res.status(400).json(MiscService.response(400, process.env.ALREADY_EXIST, {}))
      }
      const data = await checkExisting(userAdmin);
      res.status(201)
        .json(MiscService.response(200, process.env.SUCCESS, { user: { email: data?.newUser?.email } }));

    } catch (error) {
      console.log(error)
      res.status(400).json(MiscService.response(400, error.error || process.env.WRONG_SOMETHING, {}));
    }
  }

};