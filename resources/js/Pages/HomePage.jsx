import React, { useRef, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Spline from '@splinetool/react-spline';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../Components/ui/button';
import { FlipWords } from "../Components/ui/flip-words";
import { LinkPreview } from "@/components/ui/link-preview";
import AllioraHead from '@/Components/ui/alliora-head';

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
    const fourSectionRef = useRef(null);

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

    const { scrollYProgress: fourSectionProgress } = useScroll({
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
        ["100vh", "15vh"]
    );

    const translateYFour = useTransform(
        fourSectionProgress,
        [0.6, 0.8],
        ["-100vh", "0vh"]
    );
    const [isModelVisible, setIsModelVisible] = useState(true);

    const [isModel2Visible, setIsModel2Visible] = useState(true);

    useEffect(() => {
        const handleScrollProgress = (progress) => {
            if (progress >= 0.6) {
                setIsModelVisible(false);
            } else {
                setIsModelVisible(true);
            }
        };

        return firstSectionProgress.onChange(handleScrollProgress);

    }, [firstSectionProgress]);
    useEffect(() => {

        const handleScrollProgress2 = (progress) => {
            if (progress >= 0.63) {
                setIsModel2Visible(false);
            } else {
                setIsModel2Visible(true);
            }
        };

        return firstSectionProgress.onChange(handleScrollProgress2);
    }, [firstSectionProgress]);

    return (
        <div ref={containerRef} className="relative min-h-[500vh] bg-black text-white">
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
                    <div
                        className="w-full h-full"
                    >
                        <div className="relative w-full h-[108vh] [clip-path:inset(0_0_57px_0)]">
                            <Spline scene="https://prod.spline.design/7w41iMdSSU8lwsPN/scene.splinecode" />
                        </div>
                    </div>
                </div>
                {isModelVisible && (
                    <>
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
                    </>
                )}


                {isModel2Visible && (
                    <>
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
                                    <p className='text-right w-4/5'>Developed by
                                        <LinkPreview url="https://github.com/wav-rover" className="ml-1 font-bold">
                                            Deveney Jeremy
                                        </LinkPreview>
                                        , as a study project.</p>
                                </motion.div>

                            </motion.section>
                        </motion.div>
                    </>
                )}


                {isModelVisible && (
                    <>
                        <motion.div
                            ref={secondSectionProgress}
                            style={{
                                translateY: translateYSecond,
                            }}
                            transition={{ ease: "easeInOut", duration: 1.5 }}
                            className="absolute top-0 z-30 left-0 w-full h-[110vh] bg-gradient-to-br from-[#0c0f1c] via-[#1e3a8a] to-[#0b1327] 
               shadow-[0_0_50px_rgba(0,0,0,0.8)] drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                        >
                            <motion.section className="h-full pt-20 flex items-start justify-center">
                                <motion.div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-16">

                                    <div className="max-w-2xl">
                                        <p className="text-pretty text-left text-3xl font-extrabold mb-6">
                                            Supercharge your workflow with powerful tools
                                        </p>
                                        <p className="text-pretty text-left text-3xl font-semibold mb-6">
                                            Track your progress visually in real-time
                                        </p>
                                        <p className="text-pretty text-left text-3xl font-semibold">
                                            Sync and export your tasks to Google Agenda effortlessly
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end ">
                                        <p className='text-9xl text-white/20'>ALLIORA</p>
                                        <div className="h-52 w-96 bg-white bg-white/20 rounded-br-full rounded-tr-full rounded-tl-full rounded-bl-2xl flex-shrink-0" />
                                    </div>
                                </motion.div>
                            </motion.section>
                        </motion.div>
                    </>
                )}
                <motion.div
                    ref={thirdSectionProgress}
                    style={{
                        translateY: translateYThird,
                    }}

                    transition={{ ease: "easeInOut", duration: 5 }}
                    className="absolute top-0 z-40 left-0 w-full h-screen bg-background"
                >
                    <motion.section className="h-full pt-10 px-10">
                        <div className='pl-20'>
                            <h1 className="text-2xl font-bold  text-white/70 mb-2">Alliora <span className="italic text-gray-600 mb-4">(proper noun)</span></h1>
                            <h2 className="text-xl font-semibold text-white/70 mb-2">Etymology</h2>
                            <ul class="list-disc text-white/70 pl-6">
                                <li>
                                    From the root <span class="font-semibold">alli-</span>, derived from Latin
                                    <span className="italic"> alligare</span> (“to bind, to connect”), symbolizing
                                    <span className="text-gray-600"> alliance</span> and <span className="text-gray-600">collaboration</span>.
                                </li>
                                <li>
                                    Combined with the suffix <span className="font-semibold">-ora</span>, from Latin
                                    <span className="italic"> hora</span> (“hour”), representing
                                    <span className="text-gray-600"> time management</span> and <span className="text-gray-600"> organization</span>.
                                </li>
                            </ul>
                        </div>

                        <motion.div className="flex items-center gap-5 mt-10 mb-5">
                            <div className='w-2/6 rounded-3xl'>
                                <img src="img/Card1.png" alt="" className='drop-shadow-[0_0_40px_rgba(200,200,200,0.1)] rounded-3xl w-full h-full' />
                            </div>

                            <div className='w-2/6 rounded-3xl'>
                                <img src="img/Card2.png" alt="" className='drop-shadow-[0_0_40px_rgba(200,200,200,0.1)] rounded-3xl w-full h-full' />
                            </div>

                            <div className='w-2/6 rounded-3xl'>
                                <img src="img/Card3.png" alt="" className='drop-shadow-[0_0_40px_rgba(200,200,200,0.1)] rounded-3xl w-full h-full' />
                            </div>
                        </motion.div>
                        <div className='w-full flex justify-end'>
                            <p className="mt-4 w-2/4 text-gray-700">
                                The name <span className="font-semibold">Alliora</span> thus signifies
                                <span className="italic">“the harmonious union of teamwork and efficient time management”</span>,
                                reflecting the purpose of an accessible online application designed for project coordination and organization.
                            </p>
                        </div>
                    </motion.section>
                </motion.div>
                <motion.div
                    ref={fourSectionRef}
                    style={{
                        translateY: translateYFour,
                    }}
                    className="absolute top-0 z-[41] left-0 w-full h-screen bg-black"
                >
                    <section className="h-full py-32 px-20">
                        <div className="px-20 flex flex-col items-center gap-12 mb-20">
                            <h2
                                className="text-5xl  font-bold text-center"
                            >
                                Join the Alliora crew
                                <div className='mt-2'>
                                    <div className="absolute inset-x-0  flex justify-center">
                                        <div className="bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-2/5 blur-sm" />
                                    </div>
                                    <div className="absolute inset-x-0 flex justify-center">
                                        <div className="bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-2/5" />
                                    </div>
                                    <div className="absolute inset-x-0 flex justify-center">
                                        <div className="bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[2px] w-1/4 blur-sm" />
                                    </div>
                                    <div className="absolute inset-x-0  flex justify-center">
                                        <div className="bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
                                    </div>
                                </div>
                            </h2>
                            <p className="text-xl text-center max-w-2xl"
                            >
                                Thousands of teams have already transformed their workflow with Alliora. It's time for you to experience the future of project management.
                            </p>
                            <div
                            >
                                <Button
                                    variant="secondary"
                                    className="pointer-events-auto"
                                >
                                    Start Your Journey
                                </Button>
                            </div>
                            <AllioraHead />
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}