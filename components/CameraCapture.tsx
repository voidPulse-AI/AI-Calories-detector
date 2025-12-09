import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, X, SwitchCamera, Image as ImageIcon } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = useCallback(async () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasPermission(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get base64 string
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onCapture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="bg-red-500/10 p-4 rounded-full mb-4">
          <Camera className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">Camera Access Denied</h3>
        <p className="text-slate-400 mb-6">Please enable camera permissions or upload an image directly.</p>
        <div className="flex gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
            Cancel
          </button>
          <label className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition cursor-pointer flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Upload Photo
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition"
        >
          <X className="w-6 h-6" />
        </button>
        <button 
          onClick={toggleCamera}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition"
        >
          <SwitchCamera className="w-6 h-6" />
        </button>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Guides */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500 -mt-0.5 -ml-0.5 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500 -mt-0.5 -mr-0.5 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500 -mb-0.5 -ml-0.5 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500 -mb-0.5 -mr-0.5 rounded-br-lg"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-32 bg-black flex items-center justify-around px-8 pb-8 pt-4">
        <label className="p-4 rounded-full bg-slate-800 text-white cursor-pointer hover:bg-slate-700 transition">
          <ImageIcon className="w-6 h-6" />
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
        
        <button 
          onClick={handleCapture}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group"
        >
          <div className="w-16 h-16 rounded-full bg-white group-active:scale-90 transition-transform duration-100"></div>
        </button>
        
        <div className="w-14"></div> {/* Spacer for symmetry */}
      </div>
    </div>
  );
};

export default CameraCapture;
