export interface ImageType {
    _id: string;
    imgUrl: string;
    title: string;
    tags: string[];
    description?: string;
}

export interface ImagesDataType {
    images: ImageType[];
    totalPages: number;
}

