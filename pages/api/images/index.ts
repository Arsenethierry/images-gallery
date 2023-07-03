import clientPromise from "@/lib/mongodb";

const ITEMS_PER_PAGE = 10;

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const client = await clientPromise;
            const db = client.db('images');

            const page = parseInt(req.query.page) || 1;
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
            throw new Error(error).message;
        }
    }
}