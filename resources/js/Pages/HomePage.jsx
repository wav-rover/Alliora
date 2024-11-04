import { Head, Link } from '@inertiajs/react';
import Spline from '@splinetool/react-spline';
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Globe, LineChart, MessageSquare, Settings, Sparkles, Workflow } from "lucide-react"
import { Button } from '../Components/ui/button';
import { FlipWords } from "../Components/ui/flip-words";

const words = [
    "10x better",
    "the most organized",
    "endlessly awesome",
    "epic",
    "life-changing",
    "quirky",
    "game-changing",
    "ephemeral",
    "unexpected",
    "creative",
    "relentless",
    "future-ready",
    "limitless",
    "wild",
    "out-of-this-world",
    "mind-bending",
    "relaxing (not really!)",
    "next-level",
    "procrastinator-proof",
    "caffeine-fueled",
    "legendary",
    "team-powered",
];


export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation */}
            <header className="w-full pointer-events-none z-50">
                <div className='px-10 border-b border-white/10 backdrop-blur-sm'>
                    <nav className="px-24 flex items-center justify-between h-16">
                        <Link href="/" className="text-xl font-bold flex items-center gap-2">
                            ALLIORA
                        </Link>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="#" className="pointer-events-auto text-sm hover:text-blue-500 transition-colors">
                                Products
                            </Link>
                            <Link href="#" className="pointer-events-auto text-sm hover:text-blue-500 transition-colors">
                                Services
                            </Link>
                            <Link href="#" className="pointer-events-auto text-sm hover:text-blue-500 transition-colors">
                                Work
                            </Link>
                            <Link href="#" className="pointer-events-auto text-sm hover:text-blue-500 transition-colors">
                                Plans
                            </Link>
                        </div>
                        <Button variant="outline" className="pointer-events-auto text-xs h-fit border-neutral-500 bg-background">
                            {auth.user ? (
                                <Link
                                    href={route('login')}>
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}>
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </Button>
                    </nav>
                </div>
                <div className='pointer-events-auto z-0 absolute top-0 w-full'>
                </div>
                {/*<div className="mask-image-radial">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                        className='w-full h-screen'>
                        <Spline scene="https://prod.spline.design/7w41iMdSSU8lwsPN/scene.splinecode" />
                    </motion.div>
                </div>*/}
                <div className="px-4 w-3/4 mx-auto pt-[40vh]">
                    <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
                        Build
                        <FlipWords words={words} /> <br />
                        projects with Alliora Project Manager
                    </div>
                </div>
                <div className='flex justify-center pt-12'>
                    <Button variant="outline" className="pointer-events-auto animate-shimmer bg-[linear-gradient(110deg,#000103,34%,#3587d0,45%,#000103)] bg-[length:200%_100%] transition-colors drop-shadow-[0_0_10px_rgba(200,200,200,0.3)]">
                        {auth.user ? (
                            <Link
                                href={route('login')}>
                                Enter Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </Button>
                </div>
            </header>

        </div>
    );
}
