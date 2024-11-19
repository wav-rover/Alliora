import React, { useRef, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Spline from '@splinetool/react-spline';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '../Components/ui/button';
import { FlipWords } from "../Components/ui/flip-words";
import { LinkPreview } from "@/Components/ui/link-preview";
import { AllioraHead, BigAllioraHead } from '@/Components/ui/alliora-head';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/Components/ui/tooltip"

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

const fadeInVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.50,
            delay: 0.7,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

/**
 * Welcome component for the Alliora project management application
 * @param {Object} auth - Authentication object containing user information
 * @returns {JSX.Element} A complex, responsive landing page with animated sections
 */
export default function Welcome({ auth }) {
    const containerRef = useRef(null);
    const firstSectionRef = useRef(null);
    const secondSectionRef = useRef(null);
    const thirdSectionRef = useRef(null);
    const fourSectionRef = useRef(null);
    const [isRTXOn, setIsRTXOn] = useState(true);

    const toggleRTX = () => {
        setIsRTXOn(!isRTXOn);
    };

    useEffect(() => {
        if(window.matchMedia("(max-width: 768px)").matches){
            setIsRTXOn(false);
        }
        else {
            setIsRTXOn(true);
        }
    }, []); 


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
            if (progress >= 0.15) {
                setIsModelVisible(false);
            } else {
                setIsModelVisible(true);
            }
        };

        firstSectionProgress.on("change", handleScrollProgress);
    }, [firstSectionProgress]);

    useEffect(() => {
        const handleScrollProgress2 = (progress) => {
            if (progress >= 0.63) {
                setIsModel2Visible(false);
            } else {
                setIsModel2Visible(true);
            }
        };

        firstSectionProgress.on("change", handleScrollProgress2);
    }, [firstSectionProgress]);

    return (
        <div ref={containerRef} className="relative min-h-[500vh] bg-black text-white">
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden">
                {/* Navigation - Made responsive */}
                <div className='sticky top-0 px-4 md:px-10 z-50 bg-gradient-to-b from-black/90 to-transparent pointer-events-none'>
                    <nav className="px-4 md:px-24 flex items-center justify-between h-16">
                        <Link href="/" className="text-lg md:text-xl font-bold flex items-center gap-2">
                            <div className="h-4 w-5 md:h-5 md:w-6 bg-white dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
                            ALLIORA
                        </Link>
                        <div className="hidden md:flex items-center gap-8">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={toggleRTX}
                                            variant="outline"
                                            className="pointer-events-auto text-xs h-fit text-white/50 border-neutral-500/50 border-dashed bg-background"
                                        >
                                            {isRTXOn ? 'RTX ON' : 'RTX OFF'}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className=''>{isRTXOn ? 'Disable to get performance' : 'Toggle to get aura'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
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
                            )}</div>
                    </nav>
                </div>

                {/* Hero Section with 3D Model */}
                <div className="absolute inset-0 w-full">
                    <div className="w-full h-full">
                        <div className="relative w-full h-[108vh] [clip-path:inset(0_0_57px_0)]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isRTXOn ? 'spline' : 'alliora'}
                                    variants={fadeInVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="w-full h-full"
                                >
                                    {isRTXOn ? (
                                        <Spline scene="https://prod.spline.design/7w41iMdSSU8lwsPN/scene.splinecode" />
                                    ) : (
                                        <div className='ml-72 -mt-24 md:ml-0 md:mt-0  h-full w-full flex items-center justify-end px-20'>
                                            <BigAllioraHead />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {isModelVisible && (
                    <div className="pointer-events-none absolute top-0 left-0 z-10 flex flex-col items-center justify-center w-full h-full">
                        <div className="px-4 w-full md:w-3/4 mx-auto">
                            <div className="text-2xl md:text-4xl mx-auto font-normal z-10 text-neutral-600 dark:text-neutral-400">
                                Build <FlipWords words={words} /> <br />
                                projects with Alliora Project Manager
                            </div>
                            <div className='pt-8 md:pt-12'>
                                {auth.user ? (
                                    <Link href={route('login')}>
                                        <Button variant="outline" className="pointer-events-auto drop-shadow-[0_0_10px_rgba(200,200,200,0.3)]">
                                            Enter Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={route('login')}>
                                        <Button variant="outline" className="pointer-events-auto drop-shadow-[0_0_10px_rgba(200,200,200,0.3)]">
                                            Get Started
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isModel2Visible && (
                    <motion.div
                        ref={firstSectionRef}
                        style={{ translateY }}
                        transition={{ ease: "easeInOut", duration: 1.5 }}
                        className="absolute top-0 z-20 left-0 w-full h-[110vh] bg-black"
                    >
                        <motion.section className="h-full py-16 md:py-32 px-4 md:px-10">
                            <motion.div className="flex items-center flex-col gap-12 md:gap-24 mb-20">
                                <p className="pt-10 md:pt-20 w-full md:w-4/5 text-pretty text-left text-2xl md:text-4xl font-bold mb-8">
                                    Your all-in-one real-time project management solution.
                                    🤝
                                    Empowering teams to become leaders
                                    ✨
                                    in seamless collaboration and progress.
                                </p>
                                <p className='text-right w-full md:w-4/5'>
                                    Developed by
                                    <LinkPreview url="https://github.com/wav-rover" className="ml-1 font-bold">
                                        Deveney Jeremy
                                    </LinkPreview>
                                    , as a study project.
                                </p>
                            </motion.div>
                        </motion.section>
                    </motion.div>
                )}

                {isModel2Visible && (
                    <motion.div
                        ref={secondSectionRef}
                        style={{ translateY: translateYSecond }}
                        transition={{ ease: "easeInOut", duration: 1.5 }}
                        className="absolute top-0 z-30 left-0 w-full h-[110vh] bg-gradient-to-br from-[#0c0f1c] via-[#1e3a8a] to-[#0b1327] shadow-[0_0_50px_rgba(0,0,0,0.8)] drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                    >
                        <motion.section className="h-full pt-10 md:pt-20 flex items-start justify-center px-4 md:px-0">
                            <motion.div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-24 mb-16">
                                <div className="max-w-2xl px-4 md:px-0">
                                    <p className="text-pretty text-left text-xl md:text-3xl font-extrabold mb-6">
                                        Supercharge your workflow with powerful tools
                                    </p>
                                    <p className="text-pretty text-left text-xl md:text-3xl font-semibold mb-6">
                                        Track your progress visually in real-time
                                    </p>
                                    <p className="text-pretty text-left text-xl md:text-3xl font-semibold">
                                        Sync and export your tasks to Google Agenda effortlessly
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className='text-5xl md:text-9xl text-white/20'>ALLIORA</p>
                                    <div className="h-32 w-64 md:h-52 md:w-96 bg-white/20 rounded-br-full rounded-tr-full rounded-tl-full rounded-bl-2xl flex-shrink-0" />
                                </div>
                            </motion.div>
                        </motion.section>
                    </motion.div>
                )}

                <motion.div
                    ref={thirdSectionRef}
                    style={{ translateY: translateYThird }}
                    transition={{ ease: "easeInOut", duration: 5 }}
                    className="absolute top-0 z-40 left-0 w-full h-screen bg-background"
                >
                    <motion.section className="h-full pt-10 px-4 md:px-10">
                        <div className='pl-4 md:pl-20'>
                            <h1 className="text-xl md:text-2xl font-bold text-white/70 mb-2">
                                Alliora <span className="italic text-gray-600 mb-4">(proper noun)</span>
                            </h1>
                            <h2 className="text-lg md:text-xl font-semibold text-white/70 mb-2">Etymology</h2>
                            <ul className="list-disc text-white/70 pl-6 text-sm md:text-base">
                                <li>
                                    From the root <span className="font-semibold">alli-</span>, derived from Latin
                                    <span className="italic"> alligare</span> ("to bind, to connect"), symbolizing
                                    <span className="text-gray-600"> alliance</span> and <span className="text-gray-600">collaboration</span>.
                                </li>
                                <li>
                                    Combined with the suffix <span className="font-semibold">-ora</span>, from Latin
                                    <span className="italic"> hora</span> ("hour"), representing
                                    <span className="text-gray-600"> time management</span> and <span className="text-gray-600"> organization</span>.
                                </li>
                            </ul>
                        </div>

                        <motion.div className="flex flex-col md:flex-row items-center gap-5 mt-10 mb-5">
                            <div className='w-full md:w-2/6 rounded-3xl mb-4 md:mb-0'>
                                <img src="img/Card1.png" alt="" className='drop-shadow-[0_0_40px_rgba(200,200,200,0.1)] rounded-3xl w-full h-full' />
                            </div>
                            <div className='w-full md:w-2/6 rounded-3xl mb-4 md:mb-0'>
                                <img src="img/Card2.png" alt="" className='drop-shadow-[0_0_40px_rgba(200,200,200,0.1)] rounded-3xl w-full h-full' />
                            </div>
                            <div className='w-full md:w-2/6 rounded-3xl'>
                                <img src="img/Card3.png" alt="" className='drop-shadow-[0_0_40px_rgba(200,200,200,0.1)] rounded-3xl w-full h-full' />
                            </div>
                        </motion.div>

                        <div className='w-full flex justify-end'>
                            <p className="mt-4 w-full md:w-2/4 text-gray-700 text-sm md:text-base">
                                The name <span className="font-semibold">Alliora</span> thus signifies
                                <span className="italic">"the harmonious union of teamwork and efficient time management"</span>,
                                reflecting the purpose of an accessible online application designed for project coordination and organization.
                            </p>
                        </div>
                    </motion.section>
                </motion.div>

                <motion.div
                    style={{ translateY: translateYFour }}
                    className="absolute top-0 z-[41] left-0 w-full h-screen bg-black"
                >
                    <section className="h-full py-16 md:py-32 px-4 md:px-20">
                        <div className="px-4 md:px-20 flex flex-col items-center gap-8 md:gap-12 mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold text-center">
                                Join the Alliora crew
                                <div className='mt-2'>
                                    <div className="absolute inset-x-0 flex justify-center">
                                        <div className="bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-full md:w-2/5 blur-sm" />
                                    </div>
                                    <div className="absolute inset-x-0 flex justify-center">
                                        <div className="bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-full md:w-2/5" />
                                    </div>
                                    <div className="absolute inset-x-0 flex justify-center">
                                        <div className="bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[2px] w-3/4 md:w-1/4 blur-sm" />
                                    </div>
                                    <div className="absolute inset-x-0 flex justify-center">
                                        <div className="bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-3/4 md:w-1/4" />
                                    </div>
                                </div>
                            </h2>
                            <p className="text-base md:text-xl text-center max-w-2xl px-4">
                                Thousands of teams have already transformed their workflow with Alliora. It's time for you to experience the future of project management.
                            </p>
                            <div>
                                <Button
                                    variant="secondary"
                                    className="pointer-events-auto"
                                >
                                    Start Your Journey
                                </Button>
                            </div>
                            <div className="w-full md:w-auto">
                                <AllioraHead />
                            </div>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}