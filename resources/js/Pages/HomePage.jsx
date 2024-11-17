import React, { useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import Spline from '@splinetool/react-spline';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../Components/ui/button';
import { FlipWords } from "../Components/ui/flip-words";
import { LinkPreview } from "@/components/ui/link-preview";

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
];

export default function Welcome({ auth }) {
    const containerRef = useRef(null);
    const firstSectionRef = useRef(null);
    const secondSectionRef = useRef(null);
    const thirdSectionRef = useRef(null);

    // 2. Les configurations de scroll
    const { scrollYProgress: firstSectionProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const { scrollYProgress: secondSectionProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const { scrollYProgress: thirdSectionProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const translateY = useTransform(
        firstSectionProgress,
        [0, 0.2],
        ["100vh", "0vh"]
    );

    const translateYSecond = useTransform(
        secondSectionProgress,
        [0.2, 0.4],
        ["100vh", "20vh"]
    );

    const translateYThird = useTransform(
        thirdSectionProgress,
        [0.4, 0.6],
        ["100vh", "40vh"]
    );

    return (
        <div ref={containerRef} className="relative min-h-[400vh] bg-black text-white">
            {/* Main Content Container */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden">
                {/* Navigation */}
                <div className='sticky top-0 px-10 z-50 bg-gradient-to-b from-black/90 to-transparent pointer-events-none'>
                    <nav className="px-24 flex items-center justify-between h-16">
                        <Link href="/" className="text-xl font-bold flex items-center gap-2">
                            <div className="h-5 w-6 bg-white dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
                            ALLIORA
                        </Link>
                        <div className="hidden md:flex items-center gap-8"></div>
                        {auth.user ? (
                            <Link href={route('login')}>
                                <Button variant="outline" className="pointer-events-auto text-xs h-fit border-neutral-500 bg-background">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href={route('login')}>
                                <Button variant="outline" className="pointer-events-auto text-xs h-fit border-neutral-500 bg-background">
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Hero Section with 3D Model */}
                <div className="absolute inset-0 w-full]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 1.5 }}
                        className="w-full h-full"
                    >
                        <div className="relative w-full h-[108vh] [clip-path:inset(0_0_57px_0)]">
                            <Spline scene="https://prod.spline.design/7w41iMdSSU8lwsPN/scene.splinecode" />
                        </div>
                    </motion.div>
                </div>

                {/* Hero Text */}
                <div className="pointer-events-none absolute top-0 left-0 z-10 flex flex-col items-center justify-center w-full h-full">
                    <div className="px-4 w-3/4 mx-auto">
                        <div className="text-4xl mx-auto font-normal z-10 text-neutral-600 dark:text-neutral-400">
                            Build <span className='text-4xl -ml-2'><FlipWords words={words} /></span> <br />
                            projects with <span className='italic'>Alliora</span> Project Manager
                        </div>
                        <div className='pt-12'>
                            {auth.user ? (
                                <Link href={route('login')}>
                                    <Button variant="outline" className="pointer-events-auto animate-shimmer bg-[linear-gradient(110deg,#000103,34%,#3588d065,45%,#000103)] bg-[length:200%_100%] transition-colors drop-shadow-[0_0_10px_rgba(200,200,200,0.3)]">
                                        Enter Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={route('login')}>
                                    <Button variant="outline" className="pointer-events-auto animate-shimmer bg-[linear-gradient(110deg,#000103,34%,#5090F850,45%,#000103)] bg-[length:200%_100%] transition-colors drop-shadow-[0_0_10px_rgba(200,200,200,0.3)]">
                                        Get Started
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <motion.div
                    ref={firstSectionProgress}
                    style={{
                        translateY,
                    }}

                    transition={{ ease: "easeInOut", duration: 1.5 }}
                    className="absolute top-0 z-20 left-0 w-full h-[110vh] bg-black"
                >
                    <motion.section className="h-full py-32 px-10">
                        <motion.div className="flex items-center flex-col gap-24 mb-20">
                            <p className="pt-20 w-4/5 text-pretty text-left text-4xl font-bold mb-8">
                                Your all-in-one real-time project management solution.
                                <span className='px-5 rounded-full pb-1 mx-2 border border-slate-100/20 drop-shadow-[0_0_10px_rgba(200,200,200,0.5)]'>
                                    🤝
                                </span>
                                Empowering teams to become leaders
                                <span className='px-5 rounded-full pb-1 mx-2 border border-slate-100/20 drop-shadow-[0_0_10px_rgba(200,200,200,0.5)]'>
                                    ✨
                                </span>
                                in seamless collaboration and progress.
                            </p>
                            <p className='text-right w-4/5'>Made by
                                <LinkPreview url="https://github.com/wav-rover" className="ml-1 font-bold">
                                    Deveney Jeremy
                                </LinkPreview>
                                , as a study project.</p>
                        </motion.div>

                    </motion.section>
                </motion.div>

                <motion.div
                    ref={secondSectionProgress}
                    style={{
                        translateY: translateYSecond,
                    }}

                    transition={{ ease: "easeInOut", duration: 1.5 }}
                    className="absolute top-0 z-30 left-0 w-full h-screen bg-[#0c6dc8]"
                >
                    <motion.section className="h-full py-32 px-10">
                        <motion.div className="flex items-center flex-col gap-24 mb-20">
                            <p className="pt-20 w-4/5 text-pretty text-left text-4xl font-bold mb-8">
                                Transform your workflow with our intuitive tools
                                <span className='px-5 rounded-full pb-1 mx-2 border border-slate-100/20 drop-shadow-[0_0_10px_rgba(200,200,200,0.5)]'>
                                    🚀
                                </span>
                                Visualize progress in real-time
                                <span className='px-5 rounded-full pb-1 mx-2 border border-slate-100/20 drop-shadow-[0_0_10px_rgba(200,200,200,0.5)]'>
                                    📊
                                </span>
                            </p>
                            <div className="grid grid-cols-3 gap-8 w-4/5">
                                {/* Add your feature cards or content here */}
                                <div className="p-6 border border-slate-100/20 rounded-lg">
                                    <h3 className="text-xl font-bold mb-4">Real-time Updates</h3>
                                    <p className="text-neutral-400">Stay synchronized with your team's progress instantly</p>
                                </div>
                                {/* Add more cards as needed */}
                            </div>
                        </motion.div>
                    </motion.section>
                </motion.div>

                <motion.div
                    ref={thirdSectionProgress}
                    style={{
                        translateY: translateYThird,
                    }}

                    transition={{ ease: "easeInOut", duration: 5 }}
                    className="absolute top-0 z-40 left-0 w-full h-screen bg-background"
                >
                    <motion.section className="h-full py-32 px-10">
                        <motion.div className="flex items-center flex-col gap-24 mb-20">
                            <p className="pt-20 w-4/5 text-pretty text-left text-4xl font-bold mb-8">
                                Transform your workflow with our intuitive tools
                                <span className='px-5 rounded-full pb-1 mx-2 border border-slate-100/20 drop-shadow-[0_0_10px_rgba(200,200,200,0.5)]'>
                                    🚀
                                </span>
                                Visualize progress in real-time
                                <span className='px-5 rounded-full pb-1 mx-2 border border-slate-100/20 drop-shadow-[0_0_10px_rgba(200,200,200,0.5)]'>
                                    📊
                                </span>
                            </p>
                            <div className="grid grid-cols-3 gap-8 w-4/5">
                                {/* Add your feature cards or content here */}
                                <div className="p-6 border border-slate-100/20 rounded-lg">
                                    <h3 className="text-xl font-bold mb-4">Real-time Updates</h3>
                                    <p className="text-neutral-400">Stay synchronized with your team's progress instantly</p>
                                </div>
                                {/* Add more cards as needed */}
                            </div>
                        </motion.div>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    );
}