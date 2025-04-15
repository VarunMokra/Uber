const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");
const captainService = require("../services/captain.service");
const blacklistTokenModel = require("../models/blacklistToken.model");

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
  const token = captain.generateAuthToken();
  res.status(201).json({ captain, token });
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  const isValid = await captain.comparePasswords(password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid Password" });
  }
  const captainToken = captain.generateAuthToken();
  res.cookie("token", captainToken);
  res.status(200).json({ captain, token: captainToken });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json(req.captain);
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blacklistTokenModel.create({ token });
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
