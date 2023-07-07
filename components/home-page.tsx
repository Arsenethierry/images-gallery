"use client";

import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu';
import axios from 'axios';
import Image from 'next/image';
import { ImageType, ImagesDataType } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


type ImageProps = {
    imagesData: ImageType[],
    totalPages: number,
}

function HomePage({ imagesData, totalPages }: ImageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState<SetStateAction<ImageType> | any>(imagesData);
    const [searchData, setSearchData] = useState<SetStateAction<ImageType> | any>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [liked, setliked] = useState<string>('');

    const { data: session } = useSession();
    const router = useRouter();

    let timeOutid: NodeJS.Timeout;
    const handleSearch = (value: string) => {
        if (timeOutid) {
            clearTimeout(timeOutid);
        }
        timeOutid = setTimeout(() => {
            const searchParam = value;
            setSearchQuery(searchParam);
            router.push(`/?search=${searchParam}`);
        }, 500)
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            const fetchData = async () => {
                await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images?search=${searchQuery}`)
                    .then(response => setSearchData(response.data.images));
            };

            fetchData();
        }
    }, [searchQuery]);

    const isLiked = (image: ImageType) => {
        if (liked === image._id || image.likedBy.includes(session?.user?.email as string)) return true;
        return false;
    }

    const handleDoubleClick = (event: React.MouseEvent, image: ImageType) => {
        if (event.detail === 2) {
            isLiked(image) ? unlikeImage(image._id) : likeImage(image._id)
        }
        return;
    }

    const likeImage = async (id: string) => {
        if (session?.user?.email) {
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/${id}/user/${session?.user?.email}`)
                .then(response => response.status === 201 ? setliked(id) : setliked(''))
        } else {
            alert("not signed in")
        }
    }

    const unlikeImage = async (id: string) => {
        if (session?.user?.email) {
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images/${id}/user/${session?.user?.email}/unlike`)
                .then(response => response.status === 201 ? setliked('') : setliked(''))
        } else {
            alert("not signed in")
        }
    }

    const getImages = useCallback(async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images?page=${page}`);
        let newData = data.images
        if (page !== 1) {
            setData((prev: ImageType) => [...prev as typeof data, ...newData])
        } else {
            setData([...newData])
        }
    }, [page, setData])

    useEffect(() => {
        page >= totalPages ? setLoading(false) : getImages();
    }, [page, getImages, totalPages]);

    const handleInfiniteScroll = async () => {
        try {
            if (window.innerHeight + window.document.documentElement.scrollTop + 1 >= window.document.documentElement.scrollHeight) {
                setLoading(true);
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error(error)
        }
    }

    // add scroll event
    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll);
        return () => window.removeEventListener("scroll", handleInfiniteScroll);
    }, []);

    const handleLikeUnlike = (image: ImageType) => {
        if (image) {
            isLiked(image) ? unlikeImage(image._id) : likeImage(image._id)
        }
        return;
    }

    const toCapitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div>
            <div className='container py-10 h-[40vh] space-y-10 mx-auto'>
                <section className='max-w-5xl mx-auto mt-[10%]'>
                    <h1 className='capitalize text-2xl md:text-4xl lg:text-5xl font-bold text-center text-white'>Discover a world of stunning images with our gallery web app. </h1>
                </section>
                <form className="flex items-center max-w-2xl mx-auto">
                    <label htmlFor="images-search" className="sr-only">Search</label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                        </div>
                        <input
                            type="text"
                            onChange={(e) => handleSearch(e.target.value)}
                            id="images-search"
                            className="bg-[#1D2432] border border-gray-500 text-gray-300 text-sm rounded-lg block w-full pl-10 p-2.5"
                            placeholder="Search. For Ex: animals" required />
                    </div>
                </form>

            </div>
            <div className='container pb-1 mt-32 flex justify-between border-b-2 border-gray-500'>
                <h2 className='text-center text-white text-[34px] font-bold capitalize'>trending Photos</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-[#D9D9D9] text-gray-800 hover:text-gray-300 hover:bg-gray-800 focus:outline-none font-medium rounded-lg text-sm px-5 text-center inline-flex items-center">
                        Fielter Images
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Choose Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="container mt-10 columns-2 md:columns-3">
                {searchData && searchQuery.length > 0 ? searchData.map((image: ImageType) => (
                    <div key={image._id} style={{ position: 'relative' }}>
                        <Image
                            onClick={(event) => handleDoubleClick(event, image)}
                            className="mb-4 cursor-grab rounded-sm brightness-75 hover:brightness-110"
                            height={300}
                            width={500}
                            src={image.imgUrl}
                            placeholder='blur'
                            blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAFAAgDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAAB//EAB4QAAICAAcAAAAAAAAAAAAAAAECAxEABAUSIoKh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAXEQADAQAAAAAAAAAAAAAAAAAAAREy/9oADAMBAAIRAxEAPwA+hzbQ6Y8Rjjk3upDsvJLFmj1HuJWqLzD/2Q=='
                            alt={image.title}
                            key={image._id}
                            loading='lazy'
                        />
                        <button
                            type='button'
                            onClick={() => handleLikeUnlike(image)}
                            className='absolute flex justify-center items-center top-1 right-1 bg-white h-10 w-10 rounded-lg'>
                            {isLiked(image) ? <UnLikeButton className='h-10 w-10' /> : <LikeButton className='h-7 w-7' />}
                        </button>
                        <h2 className='absolute left-1 bottom-1 text-xl bg-slate-700 rounded-md px-3 py-1 text-white font-bold'>{toCapitalize(image.category)}</h2>
                        <h5 className='absolute right-1 bottom-1 text-md text-black bg-slate-400 px-4 rounded-b font-bold'>{'likes: '}{image.likeCount}</h5>
                    </div>
                )) : (

                    data.map((image: ImageType) => (
                        <div key={image._id} style={{ position: 'relative' }}>
                            <Image
                                onClick={(event) => handleDoubleClick(event, image)}
                                className="mb-4 cursor-grab rounded-sm brightness-75 hover:brightness-110"
                                height={300}
                                width={500}
                                src={image.imgUrl}
                                placeholder='blur'
                                blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAFAAgDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAAB//EAB4QAAICAAcAAAAAAAAAAAAAAAECAxEABAUSIoKh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAXEQADAQAAAAAAAAAAAAAAAAAAAREy/9oADAMBAAIRAxEAPwA+hzbQ6Y8Rjjk3upDsvJLFmj1HuJWqLzD/2Q=='
                                alt={image.title}
                                key={image._id}
                                loading='lazy'
                            />
                            <button
                                type='button'
                                onClick={() => handleLikeUnlike(image)}
                                className='absolute flex justify-center items-center top-1 right-1 bg-white h-10 w-10 rounded-lg'>
                                {isLiked(image) ? <UnLikeButton className='h-10 w-10' /> : <LikeButton className='h-7 w-7' />}
                            </button>
                            <h2 className='absolute left-1 bottom-1 text-xl bg-slate-700 rounded-md px-3 py-1 text-white font-bold'>{toCapitalize(image.category)}</h2>
                            <h5 className='absolute right-1 bottom-1 text-md text-black bg-slate-400 px-4 rounded-b font-bold'>{'likes: '}{image.likeCount}</h5>
                        </div>
                    ))
                )}
            </div>
            {loading && !searchData && (
                <div className='container grid grid-2 md:grid-cols-3 gap-3 my-5'>
                    {[1, 2, 3].map(loader => (
                        <div role="status" key={loader} className="w-full space-y-8 animate-pulse md:space-y-0 md:flex md:items-center">
                            <div className="flex items-center justify-center w-full h-64 bg-gray-300 rounded">
                                <svg className="w-10 h-10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {page >= totalPages && <p className="text-gray-200 text-center my-5 text-2xl">No more Images To show</p>}
        </div>
    );
}

export default HomePage;

export const LikeButton = (props: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={256}
        height={256}
        viewBox="0 0 256 256"
        xmlSpace="preserve"
        {...props}
    >
        <defs />
        <g
            style={{
                stroke: "none",
                strokeWidth: 0,
                strokeDasharray: "none",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeMiterlimit: 10,
                fill: "none",
                fillRule: "nonzero",
                opacity: 1,
            }}
            transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
        >
            <path
                d="M 45 84.334 L 6.802 46.136 C 2.416 41.75 0 35.918 0 29.716 c 0 -6.203 2.416 -12.034 6.802 -16.42 c 4.386 -4.386 10.217 -6.802 16.42 -6.802 c 6.203 0 12.034 2.416 16.42 6.802 L 45 18.654 l 5.358 -5.358 c 4.386 -4.386 10.218 -6.802 16.42 -6.802 c 6.203 0 12.034 2.416 16.42 6.802 l 0 0 l 0 0 C 87.585 17.682 90 23.513 90 29.716 c 0 6.203 -2.415 12.034 -6.802 16.42 L 45 84.334 z M 23.222 10.494 c -5.134 0 -9.961 2 -13.592 5.63 S 4 24.582 4 29.716 s 2 9.961 5.63 13.592 L 45 78.678 l 35.37 -35.37 C 84.001 39.677 86 34.85 86 29.716 s -1.999 -9.961 -5.63 -13.592 l 0 0 c -3.631 -3.63 -8.457 -5.63 -13.592 -5.63 c -5.134 0 -9.961 2 -13.592 5.63 L 45 24.311 l -8.187 -8.187 C 33.183 12.494 28.356 10.494 23.222 10.494 z"
                style={{
                    stroke: "none",
                    strokeWidth: 1,
                    strokeDasharray: "none",
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeMiterlimit: 10,
                    fill: "rgb(0,0,0)",
                    fillRule: "nonzero",
                    opacity: 1,
                }}
                transform=" matrix(1 0 0 1 0 0) "
                strokeLinecap="round"
            />
        </g>
    </svg>
);

const UnLikeButton = (props: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={256}
        height={256}
        viewBox="0 0 256 256"
        xmlSpace="preserve"
        {...props}
    >
        <defs />
        <g
            style={{
                stroke: "none",
                strokeWidth: 0,
                strokeDasharray: "none",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeMiterlimit: 10,
                fill: "none",
                fillRule: "nonzero",
                opacity: 1,
            }}
            transform="translate(45.02412451361867 45.024124513618645) scale(1.83 1.83)"
        >
            <path
                d="M 42.901 85.549 c 1.059 1.383 3.138 1.383 4.197 0 c 7.061 -9.223 28.773 -25.692 33.475 -30.82 c 12.568 -12.568 12.568 -32.946 0 -45.514 h 0 c -8.961 -8.961 -26.859 -7.239 -34.145 3.1 c -0.699 0.992 -2.158 0.992 -2.857 0 C 36.286 1.975 18.387 0.253 9.426 9.214 h 0 c -12.568 12.568 -12.568 32.946 0 45.514 C 14.128 59.857 35.84 76.325 42.901 85.549 z"
                style={{
                    stroke: "none",
                    strokeWidth: 1,
                    strokeDasharray: "none",
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeMiterlimit: 10,
                    fill: "rgb(254,0,0)",
                    fillRule: "nonzero",
                    opacity: 1,
                }}
                transform=" matrix(1 0 0 1 0 0) "
                strokeLinecap="round"
            />
        </g>
    </svg>
);