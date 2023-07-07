import clientPromise from "@/lib/mongodb";
import { Document, ObjectId, WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    switch (method) {
        case "PUT":
            unlikeImage(req, res)
            break;
        case "POST":
        // 
        default:
            res.setHeader('allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} not supported`);
            break;
    }
}

async function unlikeImage(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id, email } = req.query;
        const client = await clientPromise;
        const db = await client.db('images').collection('images');
        const query = { _id: new ObjectId(`${id}`) }
        const update = {
            $pull: { likedBy: email },
            $inc: { likeCount: -1 },
        }
        const options = { upsert: false }
        const result = await db.updateOne(query, update, options);

        if (result.matchedCount === 0) {
            res.send("Image not found")
        } else if (result.modifiedCount === 0){
            res.send("You already liked This Image")
        }
        res.status(201).send(result.modifiedCount)
    } catch (error) {
        res.json({ error });
    }
}