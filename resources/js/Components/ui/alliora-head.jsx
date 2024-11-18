import { useState, useEffect } from 'react';

export default function AllioraHead() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({
                x: (event.clientX / window.innerWidth) * 2 - 1, 
                y: (event.clientY / window.innerHeight)  *1 - 1 
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const eyeMovement = {
        x: mousePosition.x * 20,
        y: mousePosition.y * 20
    };

    return (
        <div className="relative">
            <div className="relative h-40 w-40 rounded-full bg-blue-500/10 border border-2 border-blue-800/50 shadow-2xl">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-x-4 -mt-5 flex">
                    <div 
                        className="h-7 w-4 rounded-full bg-white drop-shadow-[0_0_10px_rgba(200,255,255,0.3)]"
                        style={{
                            transform: `translate(${eyeMovement.x}px, ${eyeMovement.y}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    />
                    <div 
                        className="h-7 w-4 rounded-full bg-white drop-shadow-[0_0_10px_rgba(200,255,255,0.3)]"
                        style={{
                            transform: `translate(${eyeMovement.x}px, ${eyeMovement.y}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}