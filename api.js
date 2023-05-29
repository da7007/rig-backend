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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
const mongo = __importStar(require("mongodb"));
const dotenv_1 = __importDefault(require("dotenv"));
const credentials = __importStar(require("../credentials/auth.json"));
const app = (0, express_1.default)();
const port = 3000;
const httpServer = http_1.default.createServer(app);
const httpsServer = https_1.default.createServer(credentials, app);
dotenv_1.default.config();
function connectToDatabase(path, collectionName, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new mongo.MongoClient("mongodb://localhost");
        yield client.connect();
        const db = client.db("rig-db");
        const collection = db.collection(collectionName);
        let item;
        switch (path) {
            case "/login":
                item = yield collection.findOne({ email_address: request.email_address });
                if (request.password === (item === null || item === void 0 ? void 0 : item.password)) {
                    return true;
                }
                else {
                    return false;
                }
            case "/register":
                try {
                    item = yield collection.insertOne({ first_name: request.first_name, last_name: request.last_name, username: request.username, email_address: request.email_address, password: request.password });
                    return true;
                }
                catch (error) {
                    console.error(`An error occured while registering the user account ${error}`);
                }
        }
        return false;
    });
}
app.use((0, cors_1.default)({
    methods: ["GET", "POST"],
    origin: "*"
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hello World!");
    const request = {
        _id: new mongo.ObjectId,
        first_name: "",
        last_name: "",
        username: "",
        email_address: req.query.email_address,
        password: req.query.password
    };
    if (yield connectToDatabase("/login", "Users", request)) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(403);
    }
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = {
        _id: new mongo.ObjectId,
        first_name: "Dylan",
        last_name: "Armstrong",
        username: req.query.username,
        email_address: req.query.email_address,
        password: req.query.password
    };
    if (yield connectToDatabase("/register", "Users", request)) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(403);
    }
}));
app.listen(port, () => {
    console.info(`Rig API is listening on port ${port}`);
});
