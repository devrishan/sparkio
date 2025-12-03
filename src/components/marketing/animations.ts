import type { MotionProps } from "framer-motion";

export const viewport: MotionProps["viewport"] = { once: true, amount: 0.3 };

export const fadeInUp: MotionProps["variants"] = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: MotionProps["variants"] = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const stagger: MotionProps["variants"] = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const slideUp: MotionProps["variants"] = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn: MotionProps["variants"] = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInLeft: MotionProps["variants"] = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRight: MotionProps["variants"] = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

export const rotateIn: MotionProps["variants"] = {
  hidden: { opacity: 0, rotate: -10, scale: 0.8 },
  visible: { opacity: 1, rotate: 0, scale: 1 },
};

export const staggerFast: MotionProps["variants"] = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const staggerSlow: MotionProps["variants"] = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

