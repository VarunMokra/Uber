const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");
const captainService = require("../services/captain.service");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, fullName, password, vehicle } = req.body;
  const { firstName, lastName } = fullName;
  const { color, plate, capacity, vehicleType } = vehicle;
  const isCaptainAlreadyExisting = await captainModel.findOne({ email });
  if (isCaptainAlreadyExisting) {
    return res.status(400).json({ message: "Captain already exists" });
  }
  const hashedPassword = await captainModel.hashPassword(password);
  const captain = await captainService.createCaptain({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    color,
    plate,
    capacity,
    vehicleType,
  });
  const token = captain.generateToken();
  res.status(201).json({ captain, token });
};
