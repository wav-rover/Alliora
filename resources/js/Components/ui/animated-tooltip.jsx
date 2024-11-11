
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useState } from "react";

export const AnimatedTooltip = ({ users }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event) => {
      const halfWidth = event.target.offsetWidth / 2;
      x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const funnyRoles = [
    'The Specialist',
    'Coolness Manager',
    'The other one',
    'The one who knows',
    'The DESTRUCTOR',
    'An angel',
    'The Artist',
    'iNtErEsTiNg PeRsOn',
    'Better than ChatGPT',
    'Doing his best',
    'Alliora Developer',
    'Secretly loves you',
    'Meme Connoisseur',
    'CEO of Napping',
    'Master of Snacks',
    'Idea Machine',
    'Certified Overthinker',
    'Coffee Wizard',
    'The Quiet Observer',
    'Hype Specialist',
    'The Mysterious One',
    'Emoji Specialist 😎',
    'The Witty Ghost',
    'Master of Coin Flips',
    'Chairman of the Fun Club',
    'The Phantom of Deadlines',
    'Self-Proclaimed Legend',
    'The Wise Fool',
    'Chief Distraction Officer',
    'The One That Cares',
    'Random Trivia Generator',
    'Reality Bender',
    'Possibly a Time Traveler',
    'The Lost One',
    'Captain Procrastinator',
];


  return (
      <div className='scale-75 ml-10  mb-5 flex absolute bottom-0 left-0'>
          {users.map((user, idx) => (
              <div
                  className="-mr-2 relative group z-10"
                  key={user.id}
                  onMouseEnter={() => setHoveredIndex(user.id)}
                  onMouseLeave={() => setHoveredIndex(null)}
              >
                  <AnimatePresence mode="popLayout">
                      {hoveredIndex === user.id && (
                          <motion.div
                              initial={{ opacity: 0, y: 20, scale: 0.6 }}
                              animate={{
                                  opacity: 1,
                                  y: 0,
                                  scale: 1,
                                  transition: {
                                      type: "spring",
                                      stiffness: 260,
                                      damping: 10,
                                  },
                              }}
                              exit={{ opacity: 0, y: 20, scale: 0.6 }}
                              style={{
                                  translateX: translateX,
                                  rotate: rotate,
                                  whiteSpace: "nowrap",
                              }}
                              className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
                          >
                              <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
                              <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
                              <div className="font-bold text-white relative z-30 text-base">
                                  {user.name}
                              </div>
                              <div className="text-white text-xs">
                                  {funnyRoles[Math.floor(Math.random() * funnyRoles.length)]}
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
                  <motion.img
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onMouseMove={handleMouseMove}
                      height={100}
                      width={100}
                      src={user.img_profile}
                      alt={user.name}
                      className={`object-cover rounded-full h-14 w-14 border-2 ${
                          user.role === 'admin' ? 'border-yellow-400' : 'border-white'
                      } relative transition duration-500 group-hover:scale-105 group-hover:z-30`}
                  />
              </div>
          ))}
      </div>
  );
};

export default AnimatedTooltip;