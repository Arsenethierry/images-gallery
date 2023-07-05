"use client";

import React, { SetStateAction, useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import axios from 'axios';
import Image from 'next/image';
import { ImageType, ImagesDataType } from '@/lib/types';
import { useRouter } from 'next/navigation';


type ImageProps = {
    imagesData: ImagesDataType
}

function HomePage({ imagesData }: ImageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState<SetStateAction<ImagesDataType> | any>(imagesData);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

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
        }, 700)
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images?search=${searchQuery}`);
            //   setData(data);
        };

        fetchData();
    }, [searchQuery]);

    const handleDoubleClick = (event: React.MouseEvent, itemId: string) => {
        if (event.detail === 2) console.log(itemId, "doble cliecked")
    }

    const getImages = async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images?page=${page}`);
        let newData = data.images
        setData([...newData])
        if (page !== 1) {
            setData((prev: ImageType) => [...prev as typeof data, ...newData])
        } else {
            setData([...newData])
        }
        // setTimeout(() => setLoading(false), 500)
    }

    useEffect(() => {
        getImages();
    }, [page]);

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
                            placeholder="Search" required />
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
                {data.map((image: ImageType) =>
                    <Image
                        onClick={(event) => handleDoubleClick(event, image._id)}
                        className="mb-4 cursor-grab"
                        height={300}
                        width={500}
                        src={image.imgUrl}
                        alt={image.title}
                        key={image._id}
                    />
                )}


            </div>
            {loading && (
                <div className='container grid md:grid-cols-3 gap-3 my-5'>
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
        </div>
    );
}

export default HomePage;