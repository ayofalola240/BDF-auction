import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User, UserDoc } from "../models/users";
import dotenv from "dotenv";
dotenv.config();

// Serialize and Deserialize User
passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done: any) => {
  const user = await User.findById(id);
  done(null, user);
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      console.log(profile);
      const { id, emails, name, photos } = profile;
      const email = emails && emails[0].value;

      if (!email) {
        return done(new Error("Email is required"));
      }

      let user: UserDoc | null = await User.findOne({ email });

      if (!user) {
        user = User.build({
          email,
          password: id, // Set password as Google ID or handle appropriately
          google: id,
          firstName: name.givenName,
          lastName: name.familyName,
          image: photos[0].value,
        });
        await user.save();
      }

      done(null, user);
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: "/api/v1/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "photos"], // Request necessary profile fields
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      console.log(profile);
      const { id, emails, name, photos } = profile;
      const email = emails && emails[0].value;

      if (!email) {
        return done(new Error("Email is required"));
      }

      let user: UserDoc | null = await User.findOne({ email });

      if (!user) {
        user = User.build({
          email,
          password: id, // Set password as Facebook ID or handle appropriately
          facebook: id,
          firstName: name?.givenName || name?.firstName,
          lastName: name?.familyName || name?.lastName,
          image: photos[0].value,
        });
        await user.save();
      }

      done(null, user);
    }
  )
);

export default passport;
