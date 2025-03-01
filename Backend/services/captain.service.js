const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
  firstName,
  lastName,
  email,
  password,
  color,
  capacity,
  plate,
  vehicleType,
}) => {
  if (!firstName) throw new Error("First name is required");
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");
  if (!color) throw new Error("Color is required");
  if (!capacity) throw new Error("Capacity is required");
  if (!plate) throw new Error("Plate is required");
  if (!vehicleType) throw new Error("Vehicle type is required");

  const captain = captainModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password,
    vehicle: {
      color,
      capacity,
      plate,
      vehicleType,
    },
  });
  return captain;
};
