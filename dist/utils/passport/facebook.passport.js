"use strict";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as FacebookStrategy } from "passport-facebook";
// import { User } from "../../models/users";
// passport.serializeUser((user, done) => {
//   done(null, (user as any).id);
// });
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID!,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//       callbackURL: "/api/v1/auth/facebook/callback",
//       profileFields: ["id", "emails", "name"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const { id, emails } = profile;
//       const email = emails && emails[0].value;
//       if (!email) {
//         return done(new Error("Email is required"));
//       }
//       let user = await User.findOne({ email });
//       if (!user) {
//         user = User.build({ email, password: id }); // use facebook id as password placeholder
//         await user.save();
//       }
//       done(null, user);
//     }
//   )
// );
