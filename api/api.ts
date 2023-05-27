import express from "express";
import cors from "cors";
import * as mongo from "mongodb";
import dotenv from "dotenv";

const app = express();
const port: number = 3000;

dotenv.config();

async function connectToDatabase(collectionName: string, email?: string, password?: string): Promise<Boolean> {
    const client: mongo.MongoClient = new mongo.MongoClient(process.env.DB_CONNECTION as string);
    await client.connect();
    const db: mongo.Db = client.db(process.env.DB_NAME)
    const collection = db.collection(collectionName);
    const item = await collection.findOne({ email_address: email });
    if(password === item?.password) {
        return true;
    } else {
        return false;
    } 
}

app.use(cors({
    methods: ["GET", "POST"],
    origin: "*"
}))

app.post("/login", async (req, res) => {
    const reqEmailAddress: string = req.query.email_address as string;
    const reqPassword: string = req.query.password as string;
    if(await connectToDatabase("Users", reqEmailAddress, reqPassword)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }  
});

app.listen(port, () => {
    console.info(`Rig API is listening on port ${port}`);
})