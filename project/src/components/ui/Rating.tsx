import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Rating({ value, reviews, size = 14 }: { value: number; reviews?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: star * 0.05 }}
          >
            <Star
              size={size}
              className={star <= Math.round(value) ? 'fill-gold text-gold' : 'text-white/20'}
            />
          </motion.div>
        ))}
      </div>
      <span className="text-xs text-cream/50">{value.toFixed(1)}{reviews !== undefined && ` (${reviews})`}</span>
    </div>
  );
}
