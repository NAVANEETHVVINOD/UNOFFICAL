import { motion, useScroll, useTransform } from 'framer-motion';
import styled from 'styled-components';

const ScrollDoodle = styled(motion.div)`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 100px;
  height: 400px;
  pointer-events: none;
  
  svg {
    width: 100%;
    height: 100%;
    path {
      stroke: var(--college-blue);
      stroke-width: 2;
      fill: none;
    }
  }
`;

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  );

  return (
    <ScrollDoodle style={{ opacity }}>
      <svg viewBox="0 0 100 400">
        <motion.path
          d="M50,0 Q60,100 40,200 Q20,300 50,400"
          style={{ pathLength }}
        />
        {/* Doodle elements along the path */}
        <motion.g style={{ opacity: pathLength }}>
          <circle cx="50" cy="0" r="4" fill="var(--college-red)" />
          <path d="M30,100 L70,100" stroke="var(--college-yellow)" />
          <path d="M40,200 L60,220" stroke="var(--college-green)" />
          <circle cx="50" cy="400" r="4" fill="var(--college-blue)" />
        </motion.g>
      </svg>
    </ScrollDoodle>
  );
};