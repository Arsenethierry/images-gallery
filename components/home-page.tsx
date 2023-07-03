"use client";

import React, { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import axios from 'axios';
import Image from 'next/image';

function HomePage({ imagesData }) {
    const [query, setQuery] = useState('');
    const [searchData, setSearchData] = useState('');
    let timeOutid;
    const handleSearch = (value) => {
        if (timeOutid) {
            clearTimeout(timeOutid);
        }
        timeOutid = setTimeout(() => {
            setQuery(value);
        }, 700)
    }

    const fetchImages = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images`);
        if (res.status === 200) {
            setSearchData(res.data)
        }
        return;
    }

    useEffect(() => {
        if (query.length > 0) {
            fetchImages();
        }
    }, [query])

    const handleDoubleClick = (event: React.ChangeEvent, itemId: string) => {
        if(event.detail === 2) console.log(itemId, "doble cliecked")
    }

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
            <div className="container mt-10 columns-2 md:columns-3 lg:columns-4">
                {imagesData.images.map((image) =>
                    <Image
                        onClick={(event) => handleDoubleClick(event, image._id)}
                        className="mb-4 cursor-grab"
                        height={300}
                        width={500}
                        src={image.imgUrl}
                        alt={image.title}
                    />
                )}
            </div>
        </div>
    );
}

export default HomePage;