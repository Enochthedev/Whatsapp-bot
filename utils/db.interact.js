const User = require('../database/model/user.model');

//create user db function to call in the command section
const createUser = async (user) => {
    try {
        const newUser = new User(user);
        await newUser.save();
        return newUser;
    } catch (err) {
        console.log(err);
    }
}

const getDetails = async (user) => {
    try {
        const userDetails = await User.findOne({ name: user });
        return userDetails;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    createUser,
    getDetails
}
