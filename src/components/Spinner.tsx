import { motion } from 'framer-motion'

export function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f7f3] w-full">
      <motion.div
        className="relative w-24 h-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#28bc98"
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset="0"
            strokeLinecap="round"
            className="circle-path"
          />
        </svg>
        <style>{`
          .circle-path {
            animation: spin 2s ease-in-out infinite;
          }
          @keyframes spin {
            0% {
              stroke-dashoffset: 251.2;
            }
            50% {
              stroke-dashoffset: 125.6;
            }
            100% {
              stroke-dashoffset: 251.2;
            }
          }
        `}</style>
      </motion.div>
    </div>
  )
}
