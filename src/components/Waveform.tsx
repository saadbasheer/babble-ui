import React from "react";
import { motion } from "framer-motion";

interface WaveformProps {
  isRecording: boolean;
  countdown: number | null;
  audioData: number[];
}

const Waveform = ({ isRecording, countdown, audioData }: WaveformProps) => {
  const getWaveHeight = () => {
    return countdown !== null
      ? ((3 - countdown) / 1) * 50
      : isRecording
      ? 150
      : 0;
  };

  const getViewBoxY = () => {
    return countdown !== null
      ? -300 + ((3 - countdown) / 3) * 300
      : isRecording
      ? 0
      : -300;
  };

  const createWavePath = (baseHeight: number, phaseShift: number) => {
    const width = 9000;
    const height = 150;
    const segmentWidth = width / (audioData.length - 1);
    let path = `M 0 ${height}`;

    for (let i = 1; i < audioData.length; i++) {
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
    return `${path} L ${width} ${height} L ${width} 300 L 0 300 Z`;
  };

  const wavePathVariants = {
    initial: (custom: { baseHeight: number; phaseShift: number }) => ({
      d: createWavePath(custom.baseHeight, custom.phaseShift),
    }),
    animate: (custom: { baseHeight: number; phaseShift: number }) => ({
      d: createWavePath(custom.baseHeight, custom.phaseShift),
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
        transition={{ duration: 0.5, ease: "easeInOut" }}
        preserveAspectRatio="xMidYMax slice"
      >
        {["#fec59a", "#febd8d", "#ffb584"].map((color, index) => (
          <motion.path
            key={color}
            fill={color}
            opacity={1 - index * 0.2}
            variants={wavePathVariants}
            initial="initial"
            animate="animate"
            custom={{
              baseHeight: Math.max(5, waveHeight - index * 10),
              phaseShift: 2 - index * 0.5,
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        ))}
      </motion.svg>
    </div>
  );
};

export default Waveform;
