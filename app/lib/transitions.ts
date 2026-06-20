import type { Variants, Transition } from 'framer-motion';

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const transitions = {
  page: {
    initial:    { opacity: 0, y: 12 },
    animate:    { opacity: 1, y: 0 },
    exit:       { opacity: 0, y: -8 },
    transition: { duration: 0.28, ease: easeOutExpo } satisfies Transition,
  },

  cardEnter: {
    initial:    { opacity: 0, y: 16 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.32, ease: easeOutExpo } satisfies Transition,
  },

  modal: {
    initial:    { opacity: 0, scale: 0.97, y: 20 },
    animate:    { opacity: 1, scale: 1,    y: 0  },
    exit:       { opacity: 0, scale: 0.96, y: 16 },
    transition: { duration: 0.24, ease: easeOutExpo } satisfies Transition,
  },

  drawer: {
    initial:    { opacity: 0, x: '100%' },
    animate:    { opacity: 1, x: '0%'   },
    exit:       { opacity: 0, x: '100%' },
    transition: { duration: 0.3, ease: easeOutExpo } satisfies Transition,
  },

  fadeIn: {
    initial:    { opacity: 0 },
    animate:    { opacity: 1 },
    exit:       { opacity: 0 },
    transition: { duration: 0.2 } satisfies Transition,
  },
} as const;

export const staggerContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.32, ease: easeOutExpo } },
};

export const hoverLift = {
  whileHover: { y: -2 },
  transition:  { duration: 0.18 },
};

export const tapScale = {
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
};
