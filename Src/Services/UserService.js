const { User } = require("../Model/userModel");

const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

module.exports = {

  getUser: (email) => {
    try {
      let data = User.findOne({ email }).populate('location');
      if (!data) {
        throw error;
      }
      return data
    } catch (error) {
      throw error;
    }
  },

  createUser: (user) => {
    return User.create(user);
  },

  getUserByid: (id) => {
    return User.findById(id).select("-password")
  },

  getUserList: async (query, loggedInUserId) => {
    try {
      const user = User.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "requests",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      // { $and: [{ $eq: ["$senderID", "$$userId"] }] },
                      { $and: [{ $eq: ["$senderID", loggedInUserId] }, { $eq: ["$recieverID", "$$userId"] }] }
                    ]
                  }
                }
              }
            ],
            as: "requests"
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            mobileNo: 1,
            requestStatus: { $ifNull: [{ $arrayElemAt: ["$requests.status", 0] }, ""] }
          }
        }
      ]);
      return user;
    } catch (error) {
      console.log(error);
    }

  },




}


