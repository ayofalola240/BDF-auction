import express from "express";
import passport from "../config/passport.config";
import { signup } from "../controllers/auth";
import { body } from "express-validator";
import { validateRequest } from "@e-mart/common";

const router = express.Router();
router.post(
  "/register",
  [
    body("firstName")
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ min: 3 })
      .withMessage("First name must not be empty"),

    body("lastName")
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 3 })
      .withMessage("Last name must not be empty"),

    body("email").isEmail().withMessage("Please enter a valid email"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password cannot be less than 8 characters"),

    body("passwordConfirm").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

    // body("role").isIn(["seller", "customer", "admin"]).withMessage("Selected role is invalid"),
  ],
  validateRequest,
  signup
);

// Google OAuth routes
// Route to start OAuth with Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback route
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect("/homepage");
});

// Facebook OAuth routes
// Route to start OAuth with Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// Google OAuth callback route
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect("/homepage");
});

export default router;
