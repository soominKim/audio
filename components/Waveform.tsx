"use client";

import React, { useEffect, useRef } from "react";

interface WaveformProps {
  isPaused: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isPausedRef = useRef(isPaused);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextConstructor();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64; // Small size for fewer bars

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        sourceRef.current = source;

        draw();
      } catch (err) {
        console.error("Error accessing microphone for waveform:", err);
      }
    };

    initAudio();

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;

    rafIdRef.current = requestAnimationFrame(draw);

    if (isPausedRef.current) {
        return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);

    ctx.clearRect(0, 0, width, height);

    const barCount = 20; // Number of bars to display
    const gap = 4;
    // Calculate total width needed for bars + gaps
    // barWidth * count + gap * (count - 1) = width
    // But we can fix bar width and center, or stretch.
    // Let's stretch.
    const totalGap = (barCount - 1) * gap;
    const barWidth = (width - totalGap) / barCount;

    // We have 32 bins (fftSize/2 = 32). We need 20 bars.
    // We can map linear.

    for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * (dataArrayRef.current.length / barCount));
        const value = dataArrayRef.current[dataIndex] || 0;

        // Scale value to height
        const percent = value / 255;
        const barHeight = Math.max(4, percent * height); // Minimum height 4px

        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2; // Center vertically

        // Colors from design
        // linear-gradient(90deg, #0d7ff2 0%, #8b5cf6 50%, #2dd4bf 100%)
        // We can approximate by picking color based on index
        let color = '#0d7ff2'; // Blue
        if (i > barCount * 0.3) color = '#8b5cf6'; // Purple
        if (i > barCount * 0.7) color = '#2dd4bf'; // Teal

        ctx.fillStyle = color;

        // Draw rounded rect
        ctx.beginPath();
        // Check if roundRect is supported
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, barWidth, barHeight, 10);
        } else {
            ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();

        // Add glow if loud
        if (percent > 0.5) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
        } else {
            ctx.shadowBlur = 0;
        }
    }
  };

  return (
    <canvas
        ref={canvasRef}
        width={600}
        height={160}
        className="w-full h-full"
    />
  );
};

export default Waveform;
