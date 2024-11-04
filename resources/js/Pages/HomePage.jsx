import { Head, Link } from '@inertiajs/react';
import Spline from '@splinetool/react-spline';
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Globe, LineChart, MessageSquare, Settings, Sparkles, Workflow } from "lucide-react"
import { Button } from '../Components/ui/button';
import { FlipWords } from "../Components/ui/flip-words";
import { SparklesCore } from "../Components/ui/sparkles"

const words = [
    "10x better",
    "the most organized",
    "endlessly awesome",
    "epic",
    "life-changing",
    "the coolest",
    "10x faster",
    "game-changing",
    "creative",
    "future-ready",
    "limitless",
    "wild",
    "out-of-this-world",
    "mind-bending",
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
            <div className='sticky top-0 px-10 z-50 border-b border-white/10 backdrop-blur-sm'>
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
            <header className="w-full h-screen z-50">
                {/*<div className="absolute w-full mask-image-radial">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                        className='w-full h-screen'>
                        <Spline scene="https://prod.spline.design/7w41iMdSSU8lwsPN/scene.splinecode" />
                    </motion.div>
                </div>*/}
                <div className="px-4 w-3/4 mx-auto pt-[40vh] pointer-events-none">
                    <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
                        Build
                        <FlipWords words={words} /> <br />
                        projects with Alliora Project Manager
                    </div>
                </div>
                <div className='flex justify-center pt-12'>
                    <Button variant="outline" className="pointer-events-auto animate-shimmer bg-[linear-gradient(110deg,#000103,34%,#3588d065,45%,#000103)] bg-[length:200%_100%] transition-colors drop-shadow-[0_0_10px_rgba(200,200,200,0.3)]">
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
            <main className='px-10'>
                <section className="px-10 py-20 flex justify-center items-start">
                    <p className="w-4/5 text-pretty text-left text-4xl font-bold mb-8">
                        Your all-in-one real-time project management solution. <span className=' px-5 rounded-full pb-1 mr-2 border border-slate-100/20 drop-shadow-[0_0_10px_rgba(200,200,200,0.5)]'>🤝</span>
                        Empowering teams to become leaders <span className=' px-5 rounded-full pb-1 mr-2 border border-slate-100/20 drop-shadow-[0_0_10px_rgba(200,200,200,0.5)]'>✨</span>in seamless collaboration and progress. Made by a student as a study project.
                    </p>
                </section>
                <section className="px-20 pb-20">
                    <h2 className="w-4/5 text-pretty text-left text-4xl font-bold mb-8">The Service</h2>
                    <div className='flex gap-10 justify-center items-center'>
                        <div className='aspect-square rounded-md container border border-neutral-900 bg-background h-96 p-5'>
                            <div className='rounded-md container border border-neutral-900 bg-background h-full p-5'>
                                <SparklesCore
                                    background="transparent"
                                    minSize={0.4}
                                    maxSize={1}
                                    particleDensity={500}
                                    className="w-full h-full"
                                    particleColor="#FFFFFF"
                                />
                            </div>
                        </div>
                        <div className='aspect-square rounded-md container border border-neutral-900 bg-background h-96 p-5'>
                            <div className='rounded-md container border border-neutral-900 bg-background h-full p-5'>
                                <SparklesCore
                                    background="transparent"
                                    minSize={0.4}
                                    maxSize={1}
                                    particleDensity={500}
                                    className="w-full h-full"
                                    particleColor="#FFFFFF"
                                />
                            </div>
                        </div>
                        <div className='aspect-square rounded-md container border border-neutral-900 bg-background h-96 p-5'>
                            <div className='rounded-md container border border-neutral-900 bg-background h-full p-5'>
                                <SparklesCore
                                    background="transparent"
                                    minSize={0.4}
                                    maxSize={1}
                                    particleDensity={500}
                                    className="w-full h-full"
                                    particleColor="#FFFFFF"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
