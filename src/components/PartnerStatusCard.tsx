import { motion } from "motion/react";

interface PartnerStatusCardProps {
  partner: {
    name: string;
    mood?: string;
    position?: string;
    bio?: string;
    photoURL?: string;
  };
}

export const PartnerStatusCard = ({ partner }: PartnerStatusCardProps) => {
  return (
    <motion.div
      className="bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={partner.photoURL || "/default-avatar.png"}
          alt={partner.name}
          className="w-16 h-16 rounded-full border-2 border-pink-400"
        />
        <div>
          <h2 className="text-xl font-bold text-white">
            {partner.name}
          </h2>
          <p className="text-sm text-pink-400 font-medium">
            {partner.position || "My Queen ❤️"}
          </p>
        </div>
      </div>
      {partner.mood && (
        <p className="text-gray-300">
          <span className="font-semibold">Mood:</span> {partner.mood}
        </p>
      )}
      {partner.bio && (
        <p className="text-gray-400 mt-2 italic">
          “{partner.bio}”
        </p>
      )}
    </motion.div>
  );
};
