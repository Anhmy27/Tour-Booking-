const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:9999"}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Kiểm tra xem user Google này đã tồn tại chưa (theo googleId)
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User Google đã tồn tại, đăng nhập
          return done(null, user);
        }

        // Tạo user mới từ Google
        // Lưu ý: Email có thể trùng với tài khoản thường, nhưng googleId khác nhau
        const randomPassword = Math.random().toString(36).slice(-8) + "Aa1!";
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0]?.value,
          active: true, // Google đã verify email rồi
          googleId: profile.id,
          password: randomPassword,
          passwordConfirm: randomPassword,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
