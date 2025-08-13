// components/ui/GlassCard.js

import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', style = {} }) {
    return (
        <motion.div 
            className={`glass-card overflow-hidden h-full ${className}`}
            style={style}
            // YAHAN 3D TILT EFFECT ADD KIYA HAI
            whileHover={{ 
                scale: 1.05, 
                rotateX: 8, 
                rotateY: 5,
                transition: { type: 'spring', stiffness: 300 } 
            }}
        >
            {children}
        </motion.div>
    );
}