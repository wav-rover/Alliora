import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from './Auth/Login';
import Register from './Auth/Register';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Spotlight } from "../components/ui/spotlight";

export default function AuthTabs() {
    const [activeTab, setActiveTab] = useState("login");

    // Variants for the content animation
    const scaleFadeVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4, ease: "easeInOut" } },
    };

    // Variants for the trigger animation
    const triggerVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.05 },
        active: { scale: 1.1, backgroundColor: "#0070f3", color: "#fff", transition: { duration: 0.3 } },
    };

    return (
        <div className="h-screen w-full overflow-hidden dark:bg-black bg-white dark:bg-dot-zinc-400/[0.2] bg-dot-black/[0.2]">
            {/* Gradient responsive */}
            <div className="absolute pointer-events-none inset-0 flex items-center dark:bg-black bg-white 
                [mask-image:radial-gradient(ellipse_at_center,transparent_100%,black)] 
                sm:[mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]">
            </div>
            {/* Tabs Container */}
            <div className="w-full sm:w-[400px] px-4 sm:px-0 pt-16 mx-auto">
                {/* Animated Tab Triggers */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="flex justify-between mb-5">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    {/* Set min-height to avoid trigger movement */}
                    <div className="relative min-h-[300px] sm:min-h-[350px]">
                        <AnimatePresence mode="wait">
                            {activeTab === "login" && (
                                <TabsContent value="login" key="login">
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={scaleFadeVariants}
                                    >
                                        <Login />
                                    </motion.div>
                                </TabsContent>
                            )}

                            {activeTab === "register" && (
                                <TabsContent value="register" key="register">
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={scaleFadeVariants}
                                    >
                                        <Register />
                                    </motion.div>
                                </TabsContent>
                            )}
                        </AnimatePresence>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
