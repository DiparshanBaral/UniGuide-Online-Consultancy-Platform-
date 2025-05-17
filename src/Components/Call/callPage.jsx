import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  StreamVideo,
  StreamCall,
  StreamTheme,
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';
import { getStreamVideoClient } from '../../utils/streamVideoClient';
import { sessionAtom } from '@/atoms/session';
import { useAtom } from 'jotai';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff } from 'lucide-react';
import { SpeakerLayout, PaginatedGridLayout } from '@stream-io/video-react-sdk';
import { useCall } from '@stream-io/video-react-sdk';

// This component will be used inside the StreamCall context
const CallUI = () => {
  const call = useCall();
  const { useCallCallingState, useParticipantCount, useLocalParticipant, useRemoteParticipants } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);

  useEffect(() => {
    if (localParticipant) {
      console.log('Local participant:', localParticipant);
      console.log('Local video track:', localParticipant.videoTrack);
      console.log('Local audio track:', localParticipant.audioTrack);
    }
  }, [localParticipant]);

  useEffect(() => {
    if (remoteParticipants.length > 0) {
      console.log('Remote participants:', remoteParticipants);
      remoteParticipants.forEach((participant) => {
        console.log(`Participant ${participant.name || participant.sessionId}:`, {
          videoTrack: participant.videoTrack,
          audioTrack: participant.audioTrack,
        });
      });
    }
  }, [remoteParticipants]);

  const toggleMicrophone = async () => {
    if (!call || !call.microphone) return;
    try {
      await call.microphone.toggle();
      setIsMicEnabled((prev) => !prev);
    } catch (error) {
      console.error('Error toggling microphone:', error);
    }
  };

  const toggleCamera = async () => {
    if (!call || !call.camera) return;
    try {
      await call.camera.toggle();
      setIsCameraEnabled((prev) => !prev);
    } catch (error) {
      console.error('Error toggling camera:', error);
    }
  };

  const endCall = () => {
    window.location.href = '/';
  };

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p>Waiting for other user to join...</p>
        <p>Participants: {participantCount}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <p>Participants: {participantCount}</p>

      {/* Dynamic layout using Stream SDK components */}
      <div className="flex-1 flex items-center justify-center w-full p-4">
        <SpeakerLayout>
          <PaginatedGridLayout />
        </SpeakerLayout>
      </div>

      {/* Call controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        <button
          onClick={toggleMicrophone}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
        >
          {isMicEnabled ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <button onClick={toggleCamera} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
          {isCameraEnabled ? <VideoIcon size={24} /> : <VideoOff size={24} />}
        </button>
        <button onClick={endCall} className="p-3 rounded-full bg-red-700 hover:bg-red-600">
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

// Main component that initializes the call
const CallPage = () => {
  const { callId } = useParams();
  const [call, setCall] = useState(null);
  const [session, setSession] = useAtom(sessionAtom);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [isCallValid, setIsCallValid] = useState(true);
  const [client, setClient] = useState(null);

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setSession(parsedSession);
    }
    setIsFetchingUser(false);
  }, [setSession]);

  useEffect(() => {
    if (isFetchingUser || !session) return;

    const fetchCall = async () => {
      try {
        console.log('Fetching Stream token for user:', session);

        // Fetch the Stream token from the backend
        const response = await fetch(
          `http://localhost:5000/auth/stream-token?userId=${session._id}&userName=${session.firstname} ${session.lastname}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Stream token');
        }

        const { token } = await response.json();
        console.log('Fetched Stream token:', token);

        // Initialize the StreamVideoClient
        const streamClient = getStreamVideoClient({
          apiKey: 'fr33gkj4t94h', // Replace with your actual API key
          user: {
            id: session._id,
            name: `${session.firstname} ${session.lastname}`,
          },
          token,
        });

        setClient(streamClient);

        // Create or join the call
        const newCall = streamClient.call('default', callId);

        // Add retry logic for more reliability
        let retries = 0;
        const maxRetries = 3;
        let success = false;

        while (!success && retries < maxRetries) {
          try {
            await newCall.getOrCreate({
              data: {
                members: [{ user_id: session._id, role: 'call_member' }],
              },
            });
            success = true;
          } catch (error) {
            retries++;
            console.log(`Retry attempt ${retries}/${maxRetries}`);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 sec before retry
            if (retries >= maxRetries) throw error;
          }
        }

        await newCall.join({
          microphone: 'enabled',
          camera: 'enabled',
        });
        setCall(newCall);
      } catch (error) {
        console.error('Error joining call:', error);

        // Check if the error is because the call doesn't exist anymore
        if (error.message?.includes('not found') || error.code === 404) {
          setIsCallValid(false);
        } else {
          // For other errors, we might still be able to join
          setIsCallValid(true);
        }
      }
    };

    fetchCall();
  }, [callId, session, isFetchingUser]);

  if (isFetchingUser) {
    return <div>Loading user session...</div>;
  }

  if (!isCallValid) {
    return <div>This call link is no longer valid.</div>;
  }

  if (!call || !client) {
    return <div>Loading call...</div>;
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <CallUI />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
};

export default CallPage;
