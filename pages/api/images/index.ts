import clientPromise from "@/lib/mongodb";
import { Filter, FindOptions } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const ITEMS_PER_PAGE = 4;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case "GET":
            getImages(req, res)
            break;
        case "POST":
            // 
        default:
            res.setHeader('allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} not supported`);
            break;
    }
}

async function getImages(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db('images');

        const page = parseInt(req.query.page as string ?? '1');
        const skip = (page - 1) * ITEMS_PER_PAGE;
        const limit = ITEMS_PER_PAGE;

        if (req.query.search && req.query.search.length > 0) {
            const regex = new RegExp(req.query.search as string, 'i');
            const images = await db.collection('images').find({ category: regex }).toArray();
            res.json({ images });
        } else {
            const images = await db
                .collection('images')
                .find()
                .skip(skip)
                .limit(limit)
                .toArray();
            const totalImages = await db.collection('images').countDocuments();
            const totalPages = Math.ceil(totalImages / ITEMS_PER_PAGE);

            res.json({ images, totalPages })
        }
    } catch (error) {
        res.json({ error });
    }
}