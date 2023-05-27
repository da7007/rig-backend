import express from "express";
import cors from "cors";

const app = express();
const port: number = 3000;

app.use(cors({
    methods: ["GET", "POST"],
    origin: "*"
}))

app.get("/login", (req, res) => {
    res.send(200);
});

app.listen(port, () => {
    console.info(`Rig API is listening on port ${port}`);
})