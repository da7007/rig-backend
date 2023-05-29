import express from "express";
import cors from "cors";
import * as mongo from "mongodb";
import dotenv from "dotenv";
import * as types from "./types";

const app = express();
const port: number = 3000;

dotenv.config();

async function connectToDatabase(path: string, collectionName: string, request: types.Request): Promise<Boolean> {
    const client: mongo.MongoClient = new mongo.MongoClient("mongodb://localhost");
    await client.connect();
    const db: mongo.Db = client.db("rig-db");
    const collection = db.collection(collectionName);

    let item: any;

    switch(path) {
        case "/login":
            item = await collection.findOne({ email_address: request.email_address });
            if(request.password === item?.password) {
                return true;
            }
        case "/register":
            try {
                item = await collection.insertOne({first_name: request.first_name, last_name: request.last_name, username: request.username, email_address: request.email_address, password: request.password});
                return true;
            } catch (error) {
                console.error(`An error occured while registering the user account ${error}`);

            }
        }

    return false;
}

app.use(cors({
    methods: ["GET", "POST"],
    origin: "*"
}))

app.post("/login", async (req, res) => {
    const request: types.User = {
        _id: new mongo.ObjectId,
        first_name: "",
        last_name: "",
        username: "",
        email_address: JSON.stringify(req.query.email_address),
        password: JSON.stringify(req.query.password)
    };

    if(await connectToDatabase("/login", "Users", request)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }  
});

app.post("/register", async (req, res) => {
    const request: types.User = {
        _id: new mongo.ObjectId,
        first_name: "Dylan",
        last_name: "Armstrong",
        username: req.query.username as string,
        email_address: req.query.email_address as string,
        password: req.query.password as string
    };

    if(await connectToDatabase("/register", "Users", request)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }  
});

app.listen(port, () => {
    console.info(`Rig API is listening on port ${port}`);
})