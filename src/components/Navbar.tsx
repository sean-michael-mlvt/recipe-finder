"use client";

import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/main-logo.png';
import { useEffect, useState } from 'react';
import { Session } from "next-auth";
import { doLogout } from "../app/actions/index";

import styles from './Navbar.module.css';

interface Session {
    user?: {
        name?: string;
        email?: string;
        image?: string;
    }
}

interface NavbarProps {
    session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {

    const [isLoggedIn, setIsLoggedIn ] = useState(!!session?.user);

    useEffect(() => {
        setIsLoggedIn(!!session?.user);
    }, [session]);
    
    const handleLogout = () => {
        doLogout();
        setIsLoggedIn(!!session?.user);
    };

    console.log("isLoggedIn: " + isLoggedIn);
    console.log("session?.user: " + session?.user)
    return (
        <nav className={styles.navBorder}>
            <div className='mx-auto px-2 sm:px-6 lg:px-8 py-4'>
                <div className='relative flex items-center justify-between'>

                    {/* Mobile Hamburger Button */}
                    <div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
                        {/* <!-- Mobile menu button - hamburger --> */}
                        <button
                        type='button'
                        id='mobile-dropdown-button'
                        className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ml-4'
                        aria-controls='mobile-menu'
                        aria-expanded='false'
                        >
                        <span className='absolute -inset-0.5'></span>
                        <span className='sr-only'>Open main menu</span>
                        <svg
                            className='block h-8 w-8'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            aria-hidden='true'
                        >
                            <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                            />
                        </svg>
                        </button>
                    </div>

                    <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
                        {/* <!-- Logo --> */}
                        <Link className='flex flex-shrink-0 items-center' href='/'>
                            <Image className='h-18 md:h-21 w-auto' src={logo} alt='Recipe Finder Logo' />

                            <span className='hidden md:block text-black text-4xl ml-8'>
                                <h1>RECIPE FINDER</h1>
                            </span>
                        </Link>
                        {/* <!-- Desktop Menu Hidden below md screens --> */}
                        <div className='hidden md:ml-6 md:block'>
                    <div className='flex space-x-2 h-full items-center'>
                        {isLoggedIn && (
                            <Link
                                href='/pantry'
                                className='text-xl text-black hover:border-b-2 hover:border-black rounded-md px-3 py-2'
                            >
                            Pantry
                        </Link>
                    )}
                    <Link
                        href='/new-recipes'
                        className='text-xl text-black hover:border-b-2 hover:border-black rounded-md px-3 py-2'
                    >
                        Recipes
                    </Link>
                </div>
            </div>
                    </div>

                    {/* <!-- Right Side Menu (Logged Out - Login) --> */}
                    { isLoggedIn && session?.user ? (
                        <>
                        <span className='text-oswald text-2xl '>WELCOME, {session.user?.name?.toUpperCase() || session.user?.email}</span>
                        <div className='hidden md:block md:ml-6'>
                            <div className='flex items-center'>
                                <button onClick = {handleLogout} className='cursor-pointer flex items-center text-2xl text-white bg-black text-oswald hover:text-white px-6 py-3'>
                                <span>LOGOUT</span>
                                </button>
                            </div>
                        </div>
                        </>
                    ) : (
                        <>
                        <div className='hidden md:block md:ml-6'>
                            <div className='flex items-center'>
                                <button className='cursor-pointer flex items-center text-2xl text-white bg-lake-herrick text-oswald hover:text-white px-6 py-3'>
                                <Link href="/login">LOGIN</Link>
                                </button>
                            </div>
                        </div>

                        <div className='hidden md:block md:ml-6'>
                        <div className='flex items-center'>
                            <button className='cursor-pointer flex items-center text-2xl text-white bg-black text-oswald hover:text-white px-6 py-3'>
                            <Link href="/signup">SIGNUP</Link>
                            </button>
                        </div>
                        </div>
                        </>
                    )}

                </div>
            </div>

            {/* <!-- Mobile menu, show/hide based on menu state. --> */}
            <div className='hidden' id='mobile-menu'>
                <div className='space-y-1 px-2 pb-3 pt-2'>
                <a
                    href='#'
                    className=' text-white block rounded-md px-3 py-2 text-base font-medium'
                >
                    Home
                </a>
                <a
                    href='#'
                    className='text-white block rounded-md px-3 py-2 text-base font-medium'
                >
                    About
                </a>
                <a
                    href='#'
                    className='text-white block rounded-md px-3 py-2 text-base font-medium'
                >
                    Contact
                </a>
                <button className='flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 my-4'>
                    <i className='fa-brands fa-google mr-2'></i>
                    <span>Login or Register</span>
                </button>
                </div>
            </div>
        </nav>
    );

}

export default Navbar;