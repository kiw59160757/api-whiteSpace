const {sign} = require('jsonwebtoken');


const generateToken =  (payload) => {
  return sign(payload, process.env.SECRET_JWT, {
    expiresIn: 3600,
  });
}
const generateRefreshToken = (payload)=> {
  return sign(payload, process.env.SECRET_JWT, {
    expiresIn: 12000,
  });
}

module.exports = {
  generateToken,
  generateRefreshToken
}