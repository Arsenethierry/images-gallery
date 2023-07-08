"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
interface IListItem {
    children: React.ReactElement | string
    navItemStyles: String
    NavLink: string
}

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <header className={`flex items-center z-50 sticky top-0 left-0 right-0 w-full bg-[#090A15]`}>
            <div className="container">
                <div className="relative flex items-center justify-between -mx-4">
                    <div className="max-w-full px-4 w-60">
                        <Link href={'/'}>
                            <Image src={'/logo-no-background.png'} width={200} height={100} alt="logo" />
                        </Link>
                    </div>
                    <div className="flex items-center justify-between w-full px-4">
                        <div>
                            <button
                                // @click="navbarOpen = !navbarOpen"
                                onClick={() => setOpen(!open)}
                                // :className="navbarOpen && 'navbarTogglerActive' "
                                id="navbarToggler"
                                className={` ${open && "navbarTogglerActive"
                                    } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
                            >
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-slate-950"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-slate-950"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-slate-950"></span>
                            </button>
                            <nav
                                // className="!navbarOpen && 'hidden' "
                                id="navbarCollapse"
                                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg py-5 px-6 shadow lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none ${!open && "hidden"
                                    } `}
                            >
                                <ul className="block lg:flex">
                                    <ListItem
                                        navItemStyles="text-white"
                                        NavLink="https://arsenethierry-dev.vercel.app/"
                                    >
                                        Portfolio
                                    </ListItem>
                                    <ListItem
                                        navItemStyles="text-white"
                                        NavLink="https://wa.me/%2B919014592736?text=Hi%20Arsene%2C%20I%20saw%20your%20portifolio%20and%20..."
                                    >
                                        ContactMe
                                    </ListItem>
                                </ul>
                                <ul className="block lg:hidden">
                                    <ListItem
                                        navItemStyles="text-white"
                                        NavLink="/auth/login"
                                    >
                                        Sign In
                                    </ListItem>
                                    <ListItem
                                        navItemStyles="block lg:hidden text-white"
                                        NavLink="/auth/register"
                                    >
                                        Register
                                    </ListItem>
                                </ul>
                            </nav>
                        </div>
                        <div className="justify-end hidden pr-16 sm:flex lg:pr-0">
                            {!session ? (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="py-3 text-base font-medium px-7 text-dark hover:text-primary"
                                    >
                                        Sign in
                                    </Link>

                                    <Link
                                        href="/auth/register"
                                        className="py-3 text-base font-medium text-white rounded-lg bg-primary px-7 hover:bg-opacity-90"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-white flex items-center px-5">
                                        {session?.user?.image && (
                                            <img src={session.user.image} className="h-9 rounded-full mr-2" loading="lazy" />
                                        )}
                                        {session.user?.name}
                                    </h2>
                                    <button
                                        onClick={() => signOut()}
                                        className="py-3 text-base font-medium text-white rounded-lg bg-primary px-7 hover:bg-opacity-90"
                                    >
                                        Log Out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

const ListItem = ({ children, navItemStyles, NavLink }: IListItem) => {
    return (
        <>
            <li>
                <a href={NavLink} className={`flex py-2 text-base border-slate-700 font-medium lg:ml-12 lg:inline-flex ${navItemStyles}`}>
                    {children}
                </a>
            </li>
        </>
    );
};
