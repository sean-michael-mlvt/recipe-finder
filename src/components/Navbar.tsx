"use client";

import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/main-logo.png'; // Ensure path is correct
import { useEffect, useState, useRef } from 'react';
import { doLogout } from "../app/actions/index"; // Ensure path is correct

import styles from './Navbar.module.css';

// Interface for the session prop (adjust if your session structure is different)
interface Session {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
}

interface NavbarProps {
    session: Session | null; // Expect session as a prop
}

const Navbar = ({ session }: NavbarProps) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsLoggedIn(!!session?.user);
    }, [session]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        closeMobileMenu();
        doLogout();
    };

    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                hamburgerButtonRef.current &&
                !hamburgerButtonRef.current.contains(event.target as Node)
            ) {
                closeMobileMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);


    return (
        <nav className={`${styles.navBorder} relative`}>
            <div className='mx-auto px-2 sm:px-6 lg:px-8 py-4'>
                <div className='relative flex items-center justify-between'>

                    {/* --- Mobile Hamburger Button --- */}
                    <div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
                        <button
                            ref={hamburgerButtonRef}
                            type='button'
                            className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ml-1 sm:ml-4'
                            aria-controls='mobile-menu'
                            aria-expanded={isMobileMenuOpen}
                            onClick={toggleMobileMenu}
                        >
                            <span className='absolute -inset-0.5'></span>
                            <span className='sr-only'>Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className='block h-8 w-8' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' aria-hidden='true'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'/>
                                </svg>
                            )}
                        </button>
                    </div>
                    {/* --- End Mobile Hamburger Button --- */}


                    {/* --- Logo / Title and Desktop Menu Container --- */}
                    <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
                        <Link className='flex flex-shrink-0 items-center' href='/' onClick={closeMobileMenu}>
                            <Image className='h-18 md:h-21 w-auto' src={logo} alt='Recipe Finder Logo' priority />
                            <span className='hidden md:block text-black text-4xl ml-8'>
                                <h1>RECIPE FINDER</h1>
                            </span>
                        </Link>

                        {/* Desktop Menu Links (Hidden below md) */}
                        <div className='hidden md:ml-6 md:block'>
                            <div className='flex space-x-2 h-full items-center'>
                                {/* Pantry Link (Logged In Only) */}
                                {isLoggedIn && (
                                    <Link
                                        href='/pantry'
                                        className='text-xl text-black hover:border-b-2 hover:border-black rounded-md px-3 py-2'
                                    >
                                        Pantry
                                    </Link>
                                )}
                                {/* Recipes Link (Always Visible) */}
                                <Link
                                    href='/new-recipes'
                                    className='text-xl text-black hover:border-b-2 hover:border-black rounded-md px-3 py-2'
                                >
                                    Recipes
                                </Link>
                                {/* --- REMOVED Saved Recipes Link --- */}
                            </div>
                        </div>
                    </div>
                    {/* --- End Logo / Title and Desktop Menu Container --- */}

                    {/* --- Right Side Desktop Buttons --- */}
                    <div className='hidden md:block'>
                        <div className="flex items-center space-x-4">
                            {isLoggedIn && session?.user ? (
                                <>
                                    <span className='text-oswald text-lg lg:text-2xl'>WELCOME, {session.user?.name?.toUpperCase() || session.user?.email}</span>
                                    <button onClick={handleLogout} className='cursor-pointer flex items-center text-2xl text-white bg-black text-oswald hover:text-white px-6 py-3'>
                                        <span>LOGOUT</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <button className='cursor-pointer flex items-center text-2xl text-white bg-lake-herrick text-oswald hover:text-white px-6 py-3'>
                                            LOGIN
                                        </button>
                                    </Link>
                                    <Link href="/signup">
                                        <button className='cursor-pointer flex items-center text-2xl text-white bg-black text-oswald hover:text-white px-6 py-3'>
                                            SIGNUP
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    {/* --- End Right Side Desktop Buttons --- */}

                </div>
            </div>

             {/* --- Mobile Menu Dropdown --- */}
            <div
                ref={mobileMenuRef}
                className={`md:hidden absolute top-full left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                id='mobile-menu'
            >
                <div className='space-y-1 px-4 pb-3 pt-2'>
                    {/* --- Mobile Menu Items --- */}
                    <Link href="/" onClick={closeMobileMenu} className='block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100'>
                        Recipe Finder (Home)
                    </Link>

                    {/* Pantry Link (Logged In Only) */}
                    {isLoggedIn && (
                        <Link
                            href='/pantry'
                            onClick={closeMobileMenu}
                            className='block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100'
                        >
                            Pantry
                        </Link>
                    )}
                    {/* Recipes Link (Always Visible) */}
                    <Link
                        href='/new-recipes'
                        onClick={closeMobileMenu}
                        className='block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100'
                    >
                        Recipes
                    </Link>
                    {/* --- REMOVED Saved Recipes Link --- */}

                    <hr className="my-2 border-gray-200" />

                    {/* Login/Logout/Signup for mobile */}
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className='w-full text-left block rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-100'
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                href='/login'
                                onClick={closeMobileMenu}
                                className='block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100'
                            >
                                Login
                            </Link>
                            <Link
                                href='/signup'
                                onClick={closeMobileMenu}
                                className='block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100'
                            >
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
            {/* --- End Mobile Menu Dropdown --- */}
        </nav>
    );
}

export default Navbar;