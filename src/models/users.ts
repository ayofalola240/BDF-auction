import mongoose from "mongoose";
import { Password } from "../utils/password";
import * as jwt from "jsonwebtoken";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image?: string[];
  facebook?: string;
  google?: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image?: string[];
  facebook?: string;
  google?: string;
  getSignedJwtToken(): string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    image: [],
    google: String,
    facebook: String,
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  const secret = process.env.JWT_SECRET || "default_secret";
  const expiresIn = process.env.JWT_EXPIRE || "1h";

  try {
    return jwt.sign({ id: this.id }, secret, {
      expiresIn: expiresIn,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User, UserDoc };
