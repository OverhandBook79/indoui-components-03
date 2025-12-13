import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { LayoutProps, getLayoutClasses } from '../../utils/layoutProps';
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, 
  Monitor, Copy, Check, Users, Settings, Maximize2
} from 'lucide-react';

// Generate room code like XXX-NNN-XXX (X=letter, N=number)
const generateRoomCode = (): string => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '0123456789';
  const letterSegment = () => Array(3).fill(0).map(() => letters[Math.floor(Math.random() * letters.length)]).join('');
  const numberSegment = () => Array(3).fill(0).map(() => numbers[Math.floor(Math.random() * numbers.length)]).join('');
  return `${letterSegment()}-${numberSegment()}-${letterSegment()}`;
};

// Validate room code format XXX-NNN-XXX
const isValidRoomCode = (code: string): boolean => {
  return /^[A-Z]{3}-[0-9]{3}-[A-Z]{3}$/.test(code);
};

// Test room code for demo
const TEST_ROOM_CODE = 'TES-123-COD';

export interface VideoCallProps extends LayoutProps {
  roomCode?: string;
  onRoomCodeChange?: (code: string) => void;
  onJoin?: (code: string) => void;
  onLeave?: () => void;
  theme?: 'dark' | 'light';
  showControls?: boolean;
  className?: string;
}

export interface SimpleVideoCallProps extends LayoutProps {
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  onToggleVideo?: () => void;
  onToggleMic?: () => void;
  onEndCall?: () => void;
  onShareScreen?: () => void;
  isVideoEnabled?: boolean;
  isMicEnabled?: boolean;
  isScreenSharing?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}


// Simple Video Call UI Component (without WebRTC logic - that would need a signaling server)
export const SimpleVideoCall: React.FC<SimpleVideoCallProps> = ({
  localStream,
  remoteStream,
  onToggleVideo,
  onToggleMic,
  onEndCall,
  onShareScreen,
  isVideoEnabled = true,
  isMicEnabled = true,
  isScreenSharing = false,
  theme = 'dark',
  className,
  ...layoutProps
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const layoutClasses = getLayoutClasses(layoutProps);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div 
      className={cn(
        'relative rounded-xl overflow-hidden',
        theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100',
        layoutClasses,
        className
      )}
      style={{ minHeight: '400px' }}
    >
      {/* Remote Video (full screen) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn(
            'flex flex-col items-center justify-center gap-4',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            <Users className="w-16 h-16 opacity-50" />
            <p className="text-sm">Waiting for others to join...</p>
          </div>
        )}
      </div>

      {/* Local Video (picture-in-picture) */}
      <div className="absolute top-4 right-4 w-32 h-24 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
        {localStream ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn(
            'w-full h-full flex items-center justify-center',
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          )}>
            <VideoOff className="w-6 h-6 opacity-50" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <button
          onClick={onToggleMic}
          className={cn(
            'p-3 rounded-full transition-colors',
            isMicEnabled
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-red-500 text-white'
          )}
        >
          {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={onToggleVideo}
          className={cn(
            'p-3 rounded-full transition-colors',
            isVideoEnabled
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-red-500 text-white'
          )}
        >
          {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={onShareScreen}
          className={cn(
            'p-3 rounded-full transition-colors',
            isScreenSharing
              ? 'bg-primary text-primary-foreground'
              : 'bg-white/10 hover:bg-white/20 text-white'
          )}
        >
          <Monitor className="w-5 h-5" />
        </button>

        <button
          onClick={onEndCall}
          className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Room Code Display Component
export const RoomCodeDisplay: React.FC<{
  code: string;
  onCopy?: () => void;
  className?: string;
}> = ({ code, onCopy, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-lg bg-muted',
      className
    )}>
      <span className="font-mono text-xl font-bold tracking-widest text-foreground">
        {code}
      </span>
      <button
        onClick={handleCopy}
        className="p-2 rounded-md hover:bg-accent transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

// Join Room Component
export const JoinRoomForm: React.FC<{
  onJoin: (code: string) => void;
  onCreateRoom?: () => string;
  className?: string;
}> = ({ onJoin, onCreateRoom, className }) => {
  const [code, setCode] = useState('');
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const formatCode = (value: string) => {
    // Remove non-alphanumeric characters and uppercase
    const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    // Format as XXX-NNN-XXX
    let result = '';
    for (let i = 0; i < Math.min(clean.length, 9); i++) {
      if (i === 3 || i === 6) result += '-';
      result += clean[i];
    }
    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(formatCode(e.target.value));
  };

  const handleCreate = () => {
    const newCode = onCreateRoom?.() || generateRoomCode();
    setCreatedCode(newCode);
  };

  const handleJoin = () => {
    if (isValidRoomCode(code)) {
      onJoin(code);
    }
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {createdCode && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Share this code with others:</p>
          <RoomCodeDisplay code={createdCode} />
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={handleInputChange}
          placeholder="ABC-123-XYZ"
          maxLength={11}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg border border-border bg-background',
            'font-mono text-lg tracking-widest text-center uppercase',
            'focus:outline-none focus:ring-2 focus:ring-primary'
          )}
        />
        <button
          onClick={handleJoin}
          disabled={!isValidRoomCode(code)}
          className={cn(
            'px-6 py-3 rounded-lg font-medium transition-colors',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          Join
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        onClick={handleCreate}
        className={cn(
          'w-full px-6 py-3 rounded-lg font-medium transition-colors',
          'bg-muted hover:bg-accent text-foreground'
        )}
      >
        Create New Room
      </button>
    </div>
  );
};


// Hook for using local media
export function useLocalMedia() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      setError(null);
    } catch (err) {
      setError('Failed to access camera/microphone');
      console.error('Media access error:', err);
    }
  }, []);

  const stopMedia = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicEnabled(audioTrack.enabled);
      }
    }
  }, [localStream]);

  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  return {
    localStream,
    isVideoEnabled,
    isMicEnabled,
    error,
    startMedia,
    stopMedia,
    toggleVideo,
    toggleMic,
  };
}

// Export a composite VideoCall component
export const VideoCall: React.FC<VideoCallProps> = ({
  roomCode: initialRoomCode,
  onRoomCodeChange,
  onJoin,
  onLeave,
  theme = 'dark',
  showControls = true,
  className,
  ...layoutProps
}) => {
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const [isInCall, setIsInCall] = useState(false);
  const media = useLocalMedia();
  const layoutClasses = getLayoutClasses(layoutProps);

  const handleJoin = (code: string) => {
    setRoomCode(code);
    onRoomCodeChange?.(code);
    setIsInCall(true);
    media.startMedia();
    onJoin?.(code);
  };

  const handleLeave = () => {
    setIsInCall(false);
    media.stopMedia();
    onLeave?.();
  };

  const handleCreate = () => {
    const newCode = generateRoomCode();
    setRoomCode(newCode);
    onRoomCodeChange?.(newCode);
    return newCode;
  };

  if (!isInCall) {
    return (
      <div className={cn('p-6 rounded-xl border border-border bg-card', layoutClasses, className)}>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Join a Video Call</h3>
        <JoinRoomForm onJoin={handleJoin} onCreateRoom={handleCreate} />
      </div>
    );
  }

  return (
    <div className={cn(layoutClasses, className)}>
      <SimpleVideoCall
        localStream={media.localStream}
        remoteStream={null}
        onToggleVideo={media.toggleVideo}
        onToggleMic={media.toggleMic}
        onEndCall={handleLeave}
        isVideoEnabled={media.isVideoEnabled}
        isMicEnabled={media.isMicEnabled}
        theme={theme}
        h="full"
      />
    </div>
  );
};

SimpleVideoCall.displayName = 'SimpleVideoCall';
RoomCodeDisplay.displayName = 'RoomCodeDisplay';
JoinRoomForm.displayName = 'JoinRoomForm';
VideoCall.displayName = 'VideoCall';
