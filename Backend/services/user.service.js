const userModel = require("../models/user.model");

module.exports.createUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  if (!firstName) throw new Error("First name is required");
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");

  const user = userModel.create({
    fullName: {
      firstName,
      lastName: lastName || "",
    },
    email,
    password,
  });
  return user;
};
