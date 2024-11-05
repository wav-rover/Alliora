'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

function Toast({ message, onClose, type = 'info', duration = 3000 }) {
  const iconStyles = {
    error: 'bg-red-600/50 text-white',
    success: 'bg-emerald-600/50 text-white',
    warning: 'bg-yellow-600/50 text-white',
    info: 'bg-cyan-500/50 text-white',
  };

  // Choisir une icône en fonction du type de message
  const IconComponent = {
    error: AlertCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
  }[type];

  React.useEffect(() => {
    if (message) {
      // Déclenche la fermeture automatique après "duration" millisecondes
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer); // Nettoyage du timer à la fermeture
    }
  }, [message, onClose, duration]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed mx-auto p-2 py-2 rounded-xl shadow-md bg-neutral-800/50 text-white flex items-center space-x-4"
        >
          {/* Icône avec couleur dynamique */}
          <div className={`p-1 px-2 rounded-xl ${iconStyles[type]}`}>
            <IconComponent className="w-4" />
          </div>
          
          {/* Message */}
          <span>{message}</span>

          {/* Bouton de fermeture */}
          <button
            onClick={onClose}
            className="text-white bg-transparent hover:underline focus:outline-none ml-auto"
          >
            <X className='h-4' />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;
