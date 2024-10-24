import React from "react";
import { motion } from "framer-motion";

interface WaveformProps {
  isRecording: boolean;
  countdown: number | null;
  isReceding: boolean;
  audioData: number[];
}

const Waveform = ({
  isRecording,
  countdown,
  isReceding,
  audioData,
}: WaveformProps) => {
  const getWaveHeight = () => {
    if (isReceding) return 0;
    if (countdown !== null) {
      return ((3 - countdown) / 1) * 50;
    }
    return isRecording ? 150 : 0;
  };

  const getViewBoxY = () => {
    if (isReceding) return -300; // Hide below viewport
    if (countdown !== null) {
      // Start from -300 (below) and move up to 0 during countdown
      return -300 + ((3 - countdown) / 3) * 300;
    }
    return isRecording ? 0 : -300; // 0 when recording, -300 (hidden below) otherwise
  };

  const createSmoothWavePath = (baseHeight: number, phaseShift: number) => {
    const width = 9000;
    const height = 150;
    const points = audioData.length;
    const segmentWidth = width / (points - 1);
    let path = `M 0 ${height}`;

    for (let i = 1; i < points; i++) {
      const prevX = (i - 1) * segmentWidth;
      const currX = i * segmentWidth;
      const prevY =
        height -
        audioData[i - 1] * baseHeight * Math.sin((i - 1 + phaseShift) * 2);
      const currY =
        height - audioData[i] * baseHeight * Math.sin((i + phaseShift) * 2);
      const midX = (prevX + currX) / 2;
      path += ` Q ${prevX} ${prevY}, ${midX} ${(prevY + currY) / 2}`;
    }
    path += ` L ${width} ${height} L ${width} 300 L 0 300 Z`;
    return path;
  };

  const wavePathVariants = {
    initial: (custom: { baseHeight: number; phaseShift: number }) => ({
      d: createSmoothWavePath(custom.baseHeight, custom.phaseShift),
    }),
    animate: (custom: { baseHeight: number; phaseShift: number }) => ({
      d: createSmoothWavePath(custom.baseHeight, custom.phaseShift),
    }),
  };

  const waveHeight = getWaveHeight();
  const viewBoxY = getViewBoxY();

  return (
    <div className="absolute inset-x-0 bottom-0 h-full z-0">
      <motion.svg
        className="absolute bottom-0 w-full h-full"
        initial={{ viewBox: "0 -300 600 300" }}
        animate={{ viewBox: `0 ${viewBoxY} 600 300` }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Background wave */}
        <motion.path
          fill="#fec59a"
          opacity={1}
          variants={wavePathVariants}
          initial="initial"
          animate="animate"
          custom={{ baseHeight: waveHeight, phaseShift: 2 }}
          transition={{
            duration: 0.1,
            ease: "linear",
          }}
        />
        {/* Middle wave */}
        <motion.path
          fill="#febd8d"
          opacity={0.8}
          variants={wavePathVariants}
          initial="initial"
          animate="animate"
          custom={{ baseHeight: Math.max(5, waveHeight - 15), phaseShift: 1.5 }}
          transition={{
            duration: 0.1,
            ease: "linear",
          }}
        />
        {/* Foreground wave */}
        <motion.path
          fill="#ffb584"
          opacity={0.7}
          variants={wavePathVariants}
          initial="initial"
          animate="animate"
          custom={{ baseHeight: Math.max(5, waveHeight - 25), phaseShift: 1 }}
          transition={{
            duration: 0.1,
            ease: "linear",
          }}
        />
      </motion.svg>
    </div>
  );
};

export default Waveform;
