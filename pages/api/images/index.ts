import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const ITEMS_PER_PAGE = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const client = await clientPromise;
            const db = client.db('images');

            const page = parseInt(req.query.page as string ?? '1');
            const skip = (page - 1) * ITEMS_PER_PAGE;
            const limit = ITEMS_PER_PAGE * page;

            const images = await db
                .collection('images')
                .find()
                .skip(skip)
                .limit(limit)
                .toArray();
            const totalImages = await db.collection('images').countDocuments();
            const totalPages = Math.ceil(totalImages / ITEMS_PER_PAGE);
            
            res.json({ images, totalPages })
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(error?.toString());
            }
        }
    }
}