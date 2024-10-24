"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Waveform from "./Waveform";

export default function RecordingComponent() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isRecording, setIsRecording] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [isWaveformVisible, setIsWaveformVisible] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(64).fill(0));

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    startRecordingProcess();
  }, []);

  useEffect(() => {
    if (isRecording) analyzeAudio();
    else if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
  }, [isRecording]);

  const analyzeAudio = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    setAudioData(Array.from(dataArray).map((value) => value / 255));
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

      setIsWaveformVisible(true);
      startCountdown();
    } catch (error) {
      alert("Microphone access denied or error occurred.");
      router.push("/");
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsRecording(true);
          return null;
        }
        return prev ? prev - 1 : prev;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsStopped(true);
  };

  const finishRecording = () => {
    stopAudio();
    router.push("/");
  };

  const deleteRecording = () => {
    stopAudio();
    setIsStopped(false);
    setIsWaveformVisible(false);
    router.push("/");
  };

  const resumeRecording = () => {
    setIsRecording(true);
    setIsStopped(false);
  };

  const stopAudio = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen z-10">
      {isWaveformVisible && (
        <div className="absolute inset-0 z-5 transition-opacity duration-1000">
          <Waveform
            isRecording={isRecording}
            countdown={countdown}
            audioData={audioData}
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        {countdown !== null && (
          <div className="w-[250px] h-[250px] rounded-full bg-white border text-black text-3xl flex items-center justify-center">
            {countdown}
          </div>
        )}

        {isRecording && !isStopped && (
          <button
            className="w-[250px] h-[250px] rounded-full bg-white border text-black text-2xl hover:text-[#FFB684] hover:border-[#FFB684] group relative"
            onClick={stopRecording}
          >
            Stop
            <span className="absolute inset-0 border-[#FFB684] group-hover:scale-[0.85] transition-transform duration-500"></span>
          </button>
        )}

        {isStopped && (
          <div className="flex space-x-10">
            <button
              className="w-[250px] h-[250px] rounded-full bg-white border text-black text-3xl hover:text-[#FFB684] hover:border-[#FFB684] relative group"
              onClick={finishRecording}
            >
              Done
              <span className="absolute inset-0 border-[#FFB684] group-hover:scale-[0.85] transition-transform duration-500"></span>
            </button>
            <button
              className="w-[150px] h-[150px] rounded-full bg-[#FFB684] text-black text-xl relative group"
              onClick={resumeRecording}
            >
              Resume
              <span className="absolute inset-0 border-black group-hover:scale-[0.85] transition-transform duration-500"></span>
            </button>
          </div>
        )}

        {(isRecording || isStopped) && (
          <button
            className="w-[100px] h-[100px] rounded-full bg-white text-[#FF9595] border hover:border-[#2F4858] hover:bg-[#FFB684] hover:text-[#2F4858]"
            onClick={deleteRecording}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-auto"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
