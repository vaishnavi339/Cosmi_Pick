'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import {
  initializeFaceLandmarker,
  evaluateFrameQuality,
  extractTraitsFromLandmarks,
  analyzeUploadedImage,
  getFallbackDefaultTraits,
  stopMediaStream,
  QualityChecks,
} from '@/lib/face-analysis';
import { ExtractedFaceTraits } from '@/types';

interface Props {
  onScanComplete: (traits: ExtractedFaceTraits) => void;
  onBack: () => void;
}

export function StepWebcam({ onScanComplete, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(false);
  const captureStartedRef = useRef(false);
  const lastDetectionTimeRef = useRef(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [captureNotice, setCaptureNotice] = useState<string | null>(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Quality HUD checks
  const [quality, setQuality] = useState<QualityChecks>({
    faceDetected: false,
    centered: false,
    goodLighting: false,
    holdStill: false,
    allPassed: false,
    lightingValue: 0,
    message: 'Starting camera feed...',
  });

  // Readiness indicator only; visitors capture when they choose.
  const [stableProgress, setStableProgress] = useState(0); // 0 to 100
  const stableStartTimeRef = useRef<number | null>(null);
  const lastLandmarksRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const landmarkerRef = useRef<any>(null);

  // Detect ?debug=1 in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('debug') === '1') {
        setDebugMode(true);
      }
    }
  }, []);

  // 1. Initialize Face Landmarker & Start Camera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (!mountedRef.current) {
        stopMediaStream(mediaStream);
        return;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: unknown) {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      setStream(null);
      if (videoRef.current) videoRef.current.srcObject = null;
      console.warn('Camera access denied or unavailable:', err);
      if (!mountedRef.current) return;
      setCameraError(
        'Camera access was denied or is unavailable on this device. Please allow camera permissions or upload a photo below.'
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setStream(null);
  }, []);

  // Freeze a single frame, read its landmarks, then immediately release the camera.
  const triggerCapture = useCallback(
    (landmarks?: any, lightingVal?: number) => {
      if (captureStartedRef.current) return;
      captureStartedRef.current = true;

      const video = videoRef.current;
      const lms = landmarks || lastLandmarksRef.current;

      if (!video || !lms || !streamRef.current) {
        captureStartedRef.current = false;
        setCaptureNotice('We need a clear face in the frame before capturing. Adjust your position and try again.');
        return;
      }

      video?.pause();
      const traits = extractTraitsFromLandmarks(video, lms, lightingVal || quality.lightingValue || 140);

      stopCamera();
      onScanComplete(traits);
    },
    [quality.lightingValue, onScanComplete, stopCamera]
  );

  // 3. Draw Debug Landmarks on Canvas
  const drawDebugLandmarks = useCallback((landmarks: any[]) => {
    const canvas = debugCanvasRef.current;
    if (!canvas || !videoRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks || landmarks.length === 0) return;

    const w = canvas.width;
    const h = canvas.height;

    const drawPoint = (index: number, label: string, color: string) => {
      const pt = landmarks[index];
      if (!pt) return;
      const x = (1 - pt.x) * w;
      const y = pt.y * h;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`${label}`, x + 6, y + 3);
    };

    const drawLine = (idx1: number, idx2: number, color: string) => {
      const p1 = landmarks[idx1];
      const p2 = landmarks[idx2];
      if (!p1 || !p2) return;
      ctx.beginPath();
      ctx.moveTo((1 - p1.x) * w, p1.y * h);
      ctx.lineTo((1 - p2.x) * w, p2.y * h);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    // Cheek width, jaw width, height
    drawLine(234, 454, 'rgba(206, 127, 121, 0.7)');
    drawLine(172, 397, 'rgba(140, 165, 131, 0.7)');
    drawLine(10, 152, 'rgba(217, 185, 155, 0.7)');

    drawPoint(234, 'Cheek (L)', '#B86A4B');
    drawPoint(454, 'Cheek (R)', '#B86A4B');
    drawPoint(172, 'Jaw (L)', '#71896C');
    drawPoint(397, 'Jaw (R)', '#71896C');
    drawPoint(10, 'Forehead', '#C7A77A');
    drawPoint(152, 'Chin', '#C7A77A');
    drawPoint(109, 'Tone', '#F59E0B');
    drawPoint(168, 'T-Zone', '#10B981');
    drawPoint(111, 'Eye (L)', '#EF4444');
    drawPoint(4, 'Center', '#FFFFFF');
  }, []);

  // 4. Real-Time Detection Loop
  const runDetection = useCallback(() => {
    if (!videoRef.current || !hiddenCanvasRef.current || videoRef.current.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(runDetection);
      return;
    }

    const now = performance.now();
    if (now - lastDetectionTimeRef.current < 100) {
      animationFrameRef.current = requestAnimationFrame(runDetection);
      return;
    }
    lastDetectionTimeRef.current = now;

    const video = videoRef.current;
    const canvas = hiddenCanvasRef.current;
    let detectedLandmarks: any = null;

    if (landmarkerRef.current) {
      try {
        const results = landmarkerRef.current.detectForVideo(video, performance.now());
        if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
          detectedLandmarks = results.faceLandmarks[0];
          lastLandmarksRef.current = detectedLandmarks;
        } else {
          lastLandmarksRef.current = null;
        }
      } catch {
        // Fallback or skip frame on glitch
        lastLandmarksRef.current = null;
      }
    }

    if (debugMode && detectedLandmarks) {
      drawDebugLandmarks(detectedLandmarks);
    } else if (debugCanvasRef.current) {
      const dctx = debugCanvasRef.current.getContext('2d');
      dctx?.clearRect(0, 0, debugCanvasRef.current.width, debugCanvasRef.current.height);
    }

    const checks = evaluateFrameQuality(video, canvas, detectedLandmarks);
    setQuality(checks);

    if (checks.allPassed && detectedLandmarks) {
      if (!stableStartTimeRef.current) {
        stableStartTimeRef.current = performance.now();
      }
      const elapsed = now - stableStartTimeRef.current;
      const progress = Math.min(100, Math.round((elapsed / 1200) * 100));
      setStableProgress(progress);
    } else {
      stableStartTimeRef.current = null;
      setStableProgress(0);
    }

    animationFrameRef.current = requestAnimationFrame(runDetection);
  }, [debugMode, drawDebugLandmarks]);

  useEffect(() => {
    let mounted = true;
    mountedRef.current = true;
    const videoElement = videoRef.current;

    async function setup() {
      setModelLoading(true);
      const landmarker = await initializeFaceLandmarker();
      if (mounted) {
        landmarkerRef.current = landmarker;
        setModelLoading(false);
        await startCamera();
      }
    }

    setup();

    return () => {
      mounted = false;
      mountedRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      if (videoElement) videoElement.srcObject = null;
    };
  }, [startCamera]);

  useEffect(() => {
    if (stream && !modelLoading) {
      animationFrameRef.current = requestAnimationFrame(runDetection);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stream, modelLoading, runDetection]);

  // 5. Fallback File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const traits = await analyzeUploadedImage(file);
      stopCamera();
      setUploadLoading(false);
      onScanComplete(traits);
    } catch {
      const defaultTraits = getFallbackDefaultTraits();
      stopCamera();
      setUploadLoading(false);
      onScanComplete(defaultTraits);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="rounded-[2rem] glass-card p-5 sm:p-8 border border-[#DCDACD] dark:border-white/10 shadow-[0_28px_90px_-48px_rgba(33,58,48,.38)] relative bg-white/95 dark:bg-[#222B25]/95">
        
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#B86A4B] uppercase tracking-widest">
                Step 2 of 5 • Quick Scan
              </span>
              {debugMode && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold border border-amber-500/40">
                  DEBUG MODE
                </span>
              )}
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#213A30] dark:text-[#F7F6F0]">
              Align Your Face in the Frame
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-6 text-[#68766C] dark:text-[#C1CCC2]">Face a window or soft light, center your face in the guide, then capture when the frame is steady. Your camera turns off as soon as you capture.</p>
          </div>

          {/* Fallback Upload & Debug Toggle Controls */}
          <div className="flex items-center gap-2">
            {debugMode && <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-900">Diagnostics on</span>}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              id="upload-photo-fallback-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-[#213A30] dark:text-[#F7F6F0] border border-[#DCDACD] dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-[#E2EADD]/30 transition-colors shadow-sm disabled:opacity-60"
              disabled={uploadLoading}
            >
              <Upload className="w-3.5 h-3.5 text-[#B86A4B]" />
              <span>{uploadLoading ? 'Processing...' : 'Upload Photo'}</span>
            </button>
          </div>
        </div>

        {/* Video Viewport Container */}
        <div className="relative w-full aspect-[4/3] max-h-[min(60vh,560px)] max-w-2xl mx-auto rounded-[1.75rem] overflow-hidden bg-[#17201B] border border-[#DCDACD] dark:border-white/10 shadow-[0_24px_70px_-35px_rgba(23,32,27,.55)] flex items-center justify-center">
          
          <canvas ref={hiddenCanvasRef} className="hidden" />

          {/* Camera Error Message */}
          {cameraError ? (
            <div className="p-6 text-center max-w-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm text-rose-300 leading-relaxed">{cameraError}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B86A4B] text-white font-semibold text-xs shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>Upload a Photo Instead</span>
              </button>
            </div>
          ) : (
            <>
              {/* Webcam Live Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />

              {/* Debug Landmark Canvas Overlay */}
              <canvas
                ref={debugCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
              />

              {/* Luxury Guide Oval Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div
                  className={`w-52 h-72 sm:w-60 sm:h-80 rounded-[48%] border-2 transition-all duration-300 ${
                    quality.allPassed
                      ? 'border-[#71896C] shadow-[0_0_25px_rgba(140,165,131,0.5)]'
                      : quality.faceDetected
                      ? 'border-[#B86A4B] shadow-[0_0_15px_rgba(206,127,121,0.4)]'
                      : 'border-dashed border-[#F7F6F0]/60'
                  }`}
                />
              </div>

              {/* Soft Scan Line when face detected */}
              {quality.faceDetected && (
                <div className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-[#B86A4B] to-transparent shadow-[0_0_12px_#B86A4B] animate-scan-line pointer-events-none z-10" />
              )}

              {/* Auto-Capture Progress Bar */}
              {stableProgress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/60 overflow-hidden z-20">
                  <div
                    className="h-full bg-gradient-to-r from-[#B86A4B] to-[#71896C] transition-all duration-100"
                    style={{ width: `${stableProgress}%` }}
                  />
                </div>
              )}

              {/* Debug Telemetry */}
              {debugMode && (
                <div className="absolute top-3 left-3 z-30 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-amber-200 space-y-1">
                  <div>Detected: {quality.faceDetected ? 'TRUE' : 'FALSE'}</div>
                  <div>Centered: {quality.centered ? 'TRUE' : 'FALSE'}</div>
                  <div>Luminance: {quality.lightingValue} / 255</div>
                  <div>HoldStill: {quality.holdStill ? 'TRUE' : 'FALSE'}</div>
                </div>
              )}
            </>
          )}

          {/* Model Loading Spinner */}
          {modelLoading && (
            <div className="absolute inset-0 bg-[#17201B]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-[#E2EADD] z-30">
              <RefreshCw className="w-8 h-8 animate-spin text-[#B86A4B]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#F7F6F0]">
                Preparing your private scan...
              </span>
            </div>
          )}
        </div>

        {/* Live Quality HUD Indicators */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              quality.faceDetected
                ? 'bg-[#D4E2D2]/30 border-[#71896C]/50 text-[#405C45] dark:text-[#D4E2D2]'
                : 'bg-[#F7F6F0] dark:bg-white/5 border-[#DCDACD] dark:border-white/10 text-[#68766C]'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${quality.faceDetected ? 'text-[#71896C]' : 'text-[#68766C]/40'}`} />
            <span>Face Detected</span>
          </div>

          <div
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              quality.centered
                ? 'bg-[#D4E2D2]/30 border-[#71896C]/50 text-[#405C45] dark:text-[#D4E2D2]'
                : 'bg-[#F7F6F0] dark:bg-white/5 border-[#DCDACD] dark:border-white/10 text-[#68766C]'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${quality.centered ? 'text-[#71896C]' : 'text-[#68766C]/40'}`} />
            <span>Centered</span>
          </div>

          <div
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              quality.goodLighting
                ? 'bg-[#D4E2D2]/30 border-[#71896C]/50 text-[#405C45] dark:text-[#D4E2D2]'
                : 'bg-[#F7F6F0] dark:bg-white/5 border-[#DCDACD] dark:border-white/10 text-[#68766C]'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${quality.goodLighting ? 'text-[#71896C]' : 'text-[#68766C]/40'}`} />
            <span>Good Lighting</span>
          </div>

          <div
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              quality.holdStill
                ? 'bg-[#D4E2D2]/30 border-[#71896C]/50 text-[#405C45] dark:text-[#D4E2D2]'
                : 'bg-[#F7F6F0] dark:bg-white/5 border-[#DCDACD] dark:border-white/10 text-[#68766C]'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${quality.holdStill ? 'text-[#71896C]' : 'text-[#68766C]/40'}`} />
            <span>Hold Still</span>
          </div>
        </div>

        {/* Live Feedback Status Message */}
        <div className="mt-4 p-4 rounded-2xl bg-[#F7F6F0] dark:bg-white/5 border border-[#DCDACD] dark:border-white/10 flex items-center justify-between gap-3 text-xs text-[#213A30] dark:text-[#F7F6F0]">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 text-[#B86A4B] ${quality.allPassed ? '' : 'animate-pulse'}`} />
            <span className="font-medium">{quality.message}</span>
          </div>
          {stableProgress > 0 && (
            <span className="font-bold text-[#71896C]">
              Ready {stableProgress}%
            </span>
          )}
        </div>
        {captureNotice && <p role="alert" className="mt-3 text-center text-xs font-medium text-amber-800 dark:text-amber-300">{captureNotice}</p>}

        {/* Manual Capture or Back Controls */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-full border border-[#DCDACD] dark:border-white/15 text-[#68766C] dark:text-[#A6B0A5] text-xs font-semibold hover:text-[#213A30]"
          >
            Back
          </button>

          <button
            id="manual-capture-btn"
            type="button"
            onClick={() => {
              if (!quality.faceDetected) {
                setCaptureNotice('Center your face in the frame before capturing. You can also upload a photo instead.');
                return;
              }
              setCaptureNotice(null);
              triggerCapture(lastLandmarksRef.current, quality.lightingValue);
            }}
            disabled={!stream || modelLoading || uploadLoading || !quality.allPassed}
            className="px-7 py-3.5 rounded-full font-bold text-white bg-[#213A30] hover:bg-[#14271F] dark:bg-[#E2EADD] dark:text-[#213A30] shadow-soft-luxury text-sm flex items-center gap-2 transition-all disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Camera className="w-4 h-4" />
            <span>{!stream ? 'Starting camera…' : quality.allPassed ? 'Capture photo' : 'Hold still to capture'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
