const {Passport} = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const modelAdmin = require("../model/admin.model");


let instance = new Passport();

instance.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_JWT,
      jsonWebTokenOptions: {
        ignoreExpiration: false,
      },
    },
    async function (jwtPayload, done) {
      const res = await modelAdmin.findById(jwtPayload.id)
      if (res) {
        console.log('-------');
        return done(null, res);
      } else {
        return done(null, undefined);
      }
    }
  )
);

const myPassport = instance.authenticate("jwt", {
  session: false,
});

module.exports = { myPassport };
