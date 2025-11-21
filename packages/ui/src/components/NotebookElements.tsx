import { motion } from 'framer-motion';
import styled from 'styled-components';

export const NotebookPage = styled(motion.div)`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--notebook-bg);
  padding: 40px var(--margin-left);
  
  &::before {
    content: '';
    position: absolute;
    left: calc(var(--margin-left) - 2px);
    top: 0;
    height: 100%;
    width: 2px;
    background: var(--paper-margin);
  }
  
  /* Paper texture and shadow */
  box-shadow: 
    -3px 0 6px var(--paper-shadow),
    3px 0 6px var(--paper-shadow);
`;

export const PaperClip = styled(motion.div)`
  position: absolute;
  top: -15px;
  right: 40px;
  width: 50px;
  height: 70px;
  background: var(--clip-metal);
  border-radius: 0 0 5px 5px;
  transform: rotate(-5deg);
  box-shadow: 2px 2px 5px var(--clip-shadow);
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 5px;
    right: 5px;
    height: 12px;
    background: var(--clip-shadow);
    border-radius: 2px;
  }
`;

export const NotebookCard = styled(motion.div)`
  background: var(--paper-white);
  border-radius: 8px;
  padding: 20px;
  margin: var(--card-spacing) 0;
  box-shadow: 0 2px 8px var(--paper-shadow);
  transform-origin: top center;
  
  /* Notebook paper lines */
  background-image: repeating-linear-gradient(
    transparent,
    transparent 24px,
    var(--paper-line) 25px
  );
  
  h2 {
    font-family: var(--headers);
    color: var(--college-blue);
    margin-bottom: 15px;
  }
  
  p {
    font-family: var(--handwriting);
    line-height: var(--line-height);
  }
`;

// Animation variants
export const cardAnimations = {
  hover: {
    rotate: [-1, 1],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatType: "reverse"
    }
  },
  tap: {
    scale: 0.98,
    rotate: 0
  },
  initial: {
    rotate: Math.random() * 4 - 2
  }
};

export const pageAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, y: -20 }
};