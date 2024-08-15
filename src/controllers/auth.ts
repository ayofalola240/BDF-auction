import { Request, Response } from "express";
import { BadRequestError } from "@e-mart/common";
import { User } from "../models/users";

// @desc    User (Seller, Customer, Admin) Registration
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError(
      "This email is already registered. Please use a different email or log in with your existing account."
    );
  }

  const user = User.build({ email, password, firstName, lastName });
  await user.save();

  const jwtToken = user.getSignedJwtToken();

  req.session.jwt = jwtToken;

  res.status(201).send(user);
};
