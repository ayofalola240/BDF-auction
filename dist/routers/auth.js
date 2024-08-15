"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const express_validator_1 = require("express-validator");
const common_1 = require("@e-mart/common");
const router = express_1.default.Router();
router.post("/register", [
    (0, express_validator_1.body)("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 3 })
        .withMessage("First name must not be empty"),
    (0, express_validator_1.body)("lastName")
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 3 })
        .withMessage("Last name must not be empty"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password cannot be less than 8 characters"),
    (0, express_validator_1.body)("passwordConfirm").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    (0, express_validator_1.body)("role").isIn(["seller", "customer", "admin"]).withMessage("Selected role is invalid"),
], common_1.validateRequest, auth_1.signup);
exports.default = router;
