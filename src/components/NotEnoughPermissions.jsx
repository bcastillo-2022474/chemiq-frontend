import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export function NotEnoughPermissions() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f7f3]">
      <div className="text-center">
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            className="w-48 h-48 mx-auto"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="40"
              y="40"
              width="120"
              height="120"
              rx="20"
              fill="#28bc98"
            />
            <circle cx="80" cy="85" r="15" fill="#e8f7f3" />
            <circle cx="120" cy="85" r="15" fill="#e8f7f3" />
            <path
              d="M70 130 Q100 150 130 130"
              stroke="#e8f7f3"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M60 30 L80 50 M140 30 L120 50"
              stroke="#28bc98"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M30 90 L50 90 M150 90 L170 90"
              stroke="#28bc98"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
        <motion.h1
          className="text-6xl font-bold mb-4 text-[#28bc98]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          401
        </motion.h1>
        <motion.p
          className="text-xl mb-8 text-[#1a7d64]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          ¡Ups! Parece que no tienes permiso para acceder a esta pagina
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            to="/"
            className="px-6 py-3 bg-[#28bc98] text-white rounded-full font-semibold hover:bg-[#1a7d64] transition-colors duration-300"
          >
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
