export default function AllioraHead() {
    return (
      <div className="min-h-[400px] w-full bg-black flex items-center justify-center p-8">
        <div className="relative">
          {/* Sparkles */}
          <div className="absolute inset-0 -m-8 animate-[twinkle_4s_ease-in-out_infinite] opacity-70">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute h-[2px] w-[2px] rounded-full bg-cyan-300"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          
          {/* Main sphere */}
          <div className="relative h-64 w-64 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 shadow-2xl">
            {/* Iridescent overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-purple-300/20 to-cyan-200/30" />
            
            {/* Glossy highlight */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-transparent to-transparent" />
            
            {/* Eyes */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-x-4 flex">
              <div className="h-6 w-3 rounded-full bg-white blur-[2px]" />
              <div className="h-6 w-3 rounded-full bg-white blur-[2px]" />
            </div>
            
            {/* Rainbow edge effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-pink-300/20 to-yellow-200/20 mix-blend-overlay" />
          </div>
        </div>
        
        <style jsx global>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
        `}</style>
      </div>
    )
  }