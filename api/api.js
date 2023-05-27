"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)({
    methods: ["GET", "POST"],
    origin: "*"
}));
app.get("/login", (req, res) => {
    res.send(200);
});
app.listen(port, () => {
    console.info(`Rig API is listening on port ${port}`);
});
