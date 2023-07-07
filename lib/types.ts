export interface ImageType {
    _id: string;
    imgUrl: string;
    title: string;
    tags: string[];
    description?: string;
    likedBy: string[];
    category: string;
    likeCount: number;
}

export interface ImagesDataType {
    images: ImageType[];
    totalPages: number;
}

