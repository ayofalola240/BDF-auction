"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const common_1 = require("@e-mart/common");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const auth_1 = __importDefault(require("./routers/auth"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./utils/passport/google.passport");
const body_parser_1 = __importDefault(require("body-parser"));
const swagger = (0, swagger_autogen_1.default)();
const app = (0, express_1.default)();
exports.app = app;
const corsOptions = {
    //   origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.use(body_parser_1.default.json());
// Session setup
// app.set("trust proxy", true);
app.use((0, cookie_session_1.default)({
    name: "session",
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// ROUTES
app.use("/api/v1/auth", auth_1.default);
// SWAGGER CONFIG
const config = {
    info: {
        title: "Auction API Documentation",
        description: "These are the endpoints currently available in the backend",
    },
    host: process.env.MY_BASE_URL || "localhost:4000",
    schemes: ["http"],
};
const outputFile = path_1.default.join(__dirname, "..", "./swagger.json");
const endpointsFiles = ["./routers/auth.ts"];
swagger(outputFile, endpointsFiles, config).then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.resolve().then(() => __importStar(require("./index")));
}));
const swaggerDocument = require(outputFile);
app.use("/api/v1/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.all("*", (req, res) => {
    throw new common_1.NotFoundError();
});
app.use(common_1.errorHandler);
