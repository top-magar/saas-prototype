export const transitions = {
    default: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const, // Custom cubic-bezier for smooth premium feel
    },
    slow: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
    },
    fast: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as const,
    },
    spring: {
        type: "spring",
        stiffness: 300,
        damping: 30,
    },
};

export const variants = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    },
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    },
    staggerContainer: {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
};
