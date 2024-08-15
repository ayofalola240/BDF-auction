"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const common_1 = require("@e-mart/common");
const users_1 = require("../models/users");
// @desc    User (Seller, Customer, Admin) Registration
// @route   POST /api/v1/auth/signup
// @access  Public
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = yield users_1.User.findOne({ email });
    if (existingUser) {
        throw new common_1.BadRequestError("This email is already registered. Please use a different email or log in with your existing account.");
    }
    const user = users_1.User.build({ email, password, firstName, lastName });
    yield user.save();
    const jwtToken = user.getSignedJwtToken();
    req.session.jwt = jwtToken;
    res.status(201).send(user);
});
exports.signup = signup;
