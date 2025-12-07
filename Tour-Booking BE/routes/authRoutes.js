const express = require("express");
const authController = require("./../controllers/authController");
const passport = require("../config/passport");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) {
        // Xử lý lỗi (ví dụ: email đã tồn tại)
        const errorMessage = encodeURIComponent(err.message);
        return res.redirect(`${process.env.FRONT_END_URI}/login?error=${errorMessage}`);
      }
      if (!user) {
        return res.redirect(`${process.env.FRONT_END_URI}/login?error=google_auth_failed`);
      }
      // Đăng nhập thành công
      req.user = user;
      next();
    })(req, res, next);
  },
  authController.googleCallback
);

router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

router
  .route("/profile")
  .get(
    authController.bypassInactiveProtect,
    authController.protect,
    authController.getProfile
  )
  .patch(
    authController.protect,
    authController.uploadUserPhoto,
    authController.resizeUserPhoto,
    authController.updateProfile
  );

router.get(
  "/confirmEmail/:pin",
  authController.bypassInactiveProtect,
  authController.protect,
  authController.confirmEmail
);

router.get(
  "/resendConfirmEmail",
  authController.bypassInactiveProtect,
  authController.protect,
  authController.resendConfirmEmail
);

router.post("/forgotPassword", authController.forgotPassword);

router.post("/resetPassword", authController.resetPassword);

module.exports = router;
