"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Waveform from "./Waveform";

export default function RecordingComponent() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3); // Start with 3 for countdown
  const [isRecording, setIsRecording] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [isWaveformVisible, setIsWaveformVisible] = useState(false);
  const [isWaveformReceding, setIsWaveformReceding] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(64).fill(0));

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const isAnalyzing = useRef<boolean>(false);

  // Start the recording process and countdown immediately on component mount
  useEffect(() => {
    startRecordingProcess();
  }, []);

  useEffect(() => {
    // Effect to handle analysis state changes
    if (isRecording && analyserRef.current && !isAnalyzing.current) {
      isAnalyzing.current = true;
      analyzeAudio();
    } else if (!isRecording) {
      isAnalyzing.current = false;
    }
  }, [isRecording]);

  const analyzeAudio = () => {
    if (!analyserRef.current || !isRecording) {
      isAnalyzing.current = false;
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const normalizedData = Array.from(dataArray).map((value) => value / 255);
    setAudioData(normalizedData);
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  const startRecordingProcess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.5;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;

      setIsWaveformVisible(true);
      startCountdown(); // Start the countdown immediately
    } catch (error) {
      console.error("Error in startRecordingProcess:", error);
      alert("Microphone access denied or error occurred.");
      router.push("/");
    }
  };

  const resumeRecording = () => {
    console.log("Resuming recording");
    setIsRecording(true);
    setIsStopped(false);
    setIsWaveformVisible(true);
    setIsWaveformReceding(false);
  };

  const startCountdown = () => {
    setCountdown(3); // Start from 3
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval); // Clear the interval when it reaches 1
          console.log("Countdown complete, starting recording");
          setIsRecording(true);
          setIsStopped(false);
          return null; // Reset countdown
        }
        return prev !== null ? prev - 1 : prev; // Decrement if not null
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsStopped(true);
    setIsWaveformReceding(true);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  const deleteRecording = () => {
    console.log("Deleting recording");

    setIsRecording(false);

    setIsStopped(false);
    setIsWaveformVisible(false);
    setIsWaveformReceding(false);
    router.push("/");
  };

  const finishRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsRecording(false);
    setIsStopped(false);
    setIsWaveformVisible(false);
    setIsWaveformReceding(false);
    router.push("/");
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen z-10 ">
      <div
        className={`absolute inset-0 z-5 transition-opacity duration-1000 ${
          isWaveformVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Waveform
          isRecording={isRecording}
          countdown={countdown}
          isReceding={isWaveformReceding}
          audioData={audioData}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        {countdown !== null && (
          <div className="w-[250px] h-[250px] rounded-full bg-[#ffffff] border text-[#000000] text-3xl flex items-center justify-center">
            {countdown}
          </div>
        )}

        {isRecording && !isStopped && (
          <div className="flex flex-col items-center space-y-20">
            <button
              className="relative w-[250px] h-[250px] rounded-full bg-[#ffffff] border text-[#000000] text-2xl flex items-center justify-center hover:text-[#FFB684] hover:border-[#FFB684] overflow-hidden group"
              onClick={stopRecording}
            >
              Stop
              <span className="absolute w-[250px] h-[250px] rounded-full border border-[#FFB684] scale-100 group-hover:scale-[0.85] transition-transform duration-500 ease-out"></span>
            </button>
          </div>
        )}

        {isStopped && (
          <div className="flex flex-row justify-center ml-[200px] items-center space-x-10">
            <button
              className="relative w-[250px] h-[250px] rounded-full bg-[#ffffff] border text-[#000000] text-3xl flex items-center justify-center overflow-hidden group hover:text-[#FFB684] hover:border-[#FFB684]"
              onClick={finishRecording}
            >
              Done
              <span className="absolute w-[250px] h-[250px] rounded-full border border-[#FFB684] scale-100 group-hover:scale-[0.85] transition-transform duration-500 ease-out"></span>
            </button>
            <button
              className="relative w-[150px] h-[150px] rounded-full bg-[#FFB684]  text-[#000000] text-xl flex items-center justify-center overflow-hidden group"
              onClick={resumeRecording}
            >
              Resume
              <span className="absolute w-[150px] h-[150px] rounded-full border border-black scale-100 group-hover:scale-[0.85] transition-transform duration-500 ease-out"></span>
            </button>
          </div>
        )}

        {(isRecording || isStopped) && (
          <button
            className="relative text-[#FF9595] w-[100px] h-[100px]   rounded-full bg-[#ffffff] group overflow-hidden  border hover:border-[#2F4858]  hover:bg-[#FFB684] hover:text-[#2F4858]"
            onClick={deleteRecording}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="w-6 h-6  ml-9"
            >
              <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
