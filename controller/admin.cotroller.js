const modelAdmin = require("../model/admin.model");
const bcrpyt = require("bcrypt");
const Token = require("../util/token.js");
const { verify } = require("jsonwebtoken");

const initialAdmin = async () => {
  try {
    const count = await modelAdmin.countDocuments({ username: "admin" });
    if (count > 0) {
      return;
    }
    const salt = await bcrpyt.genSalt(10);
    const hashedPassword = await bcrpyt.hash("test123456", salt);
    const newAdmin = new modelAdmin({
      firstName: "admin",
      lastName: "admin",
      username: "admin",
      password: hashedPassword,
    });
    await newAdmin.save();
  } catch (error) {
    console.log(error);
  }
};

initialAdmin();

const addAdmin = async (req, res) => {
  try {
    const Data = req.body;
    const payload = req.user;
    if (payload.role !== "A") throw true;
    const salt = await bcrpyt.genSalt(10);
    const hashedPassword = await bcrpyt.hash(Data.password, salt);
    const newAdmin = new modelAdmin({
      firstName: Data.firstName,
      lastName: Data.lastName,
      username: Data.username,
      password: hashedPassword,
      role: Data.role,
    });
    await newAdmin.save();
    res.send({
      message: "Success",
    });
  } catch (error) {
    res.status(500).send({
      error: 1,
      message: "Error",
    });
  }
};

const newPass = async (req, res) => {
  try {
    const Data = req.body;
    const payload = req.user;
    if (payload.role !== "A") throw true;
    const salt = await bcrpyt.genSalt(10);
    const hashedPassword = await bcrpyt.hash(Data.password, salt);
    await modelAdmin.findOneAndUpdate(
      { username: Data.username },
      { password: hashedPassword }
    );
    res.send({
      message: "Success",
    });
  } catch (error) {
    res.status(500).send({
      error: 1,
      message: "Error",
    });
  }
};

const signIn = async (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password.toLowerCase();
  const result = await modelAdmin.findOne({ username });

  if (result) {
    const check = await bcrpyt.compare(password, result.password);

    if (check) {
      res.send({
        success: true,
        token: Token.generateToken({ id: result._id }),
        refreshToken: Token.generateRefreshToken({ id: result._id }),
        user: {
          username: result.username,
          fullname: `${result.firstName} ${result.lastName}`,
          role: result.role,
        },
      });
    } else {
      res.status(500).send({
        error: 1,
        message: "Invalid password",
        success: false,
      });
    }
  } else {
    res.status(500).send({
      error: 1,
      message: "Invalid password",
      success: false,
    });
  }
};

const refreshToken = (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    const payload = verify(refreshToken, config.SECRET_JWT, (err, payload) => {
      if (err) return reject(createError.Unauthorized());
      return payload;
    });
    res.send({
      token: Token.generateToken({
        id: payload.id,
      }),
      refreshToken: Token.generateRefreshToken({
        id: payload.id,
      }),
    });
  } catch (error) {
    res.status(400).send({
      error: 1,
    });
  }
};

module.exports = {
  signIn,
  refreshToken,
  addAdmin,
  newPass
};
