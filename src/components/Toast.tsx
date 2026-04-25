import { useEffect } from "react";
import { motion } from "motion/react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const bgMap = {
  success: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
  error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
  info: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
};

export const Toast = ({ id, message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgMap[type]} backdrop-blur-sm`}
    >
      {iconMap[type]}
      <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
        {message}
      </p>
      <button onClick={() => onClose(id)} className="text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
