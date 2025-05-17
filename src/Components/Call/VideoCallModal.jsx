import PropTypes from 'prop-types';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useState } from 'react';

const VideoCallModal = ({ call, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);

  const toggleMicrophone = async () => {
    try {
      if (isMuted) {
        await call.microphone.enable();
        setIsMuted(false);
      } else {
        await call.microphone.disable();
        setIsMuted(true);
      }
    } catch (error) {
      console.error('Error toggling microphone:', error);
    }
  };

  const toggleCamera = async () => {
    try {
      if (isCameraEnabled) {
        await call.camera.disable();
        setIsCameraEnabled(false);
      } else {
        await call.camera.enable();
        setIsCameraEnabled(true);
      }
    } catch (error) {
      console.error('Error toggling camera:', error);
    }
  };

  const leaveCall = async () => {
    try {
      await call.leave();
      onClose();
    } catch (error) {
      console.error('Error leaving call:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex flex-col">
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Video Call</h2>
          <button onClick={leaveCall} className="text-white hover:text-gray-200">
            <PhoneOff size={24} />
          </button>
        </div>
        <div className="flex-grow bg-gray-900 text-white flex items-center justify-center">
          <p>Video Call UI</p>
        </div>
        <div className="bg-gray-800 p-4 flex justify-center space-x-4">
          <button onClick={toggleMicrophone} className="p-3 rounded-full bg-gray-700">
            {isMuted ? <MicOff size={24} color="white" /> : <Mic size={24} color="white" />}
          </button>
          <button onClick={toggleCamera} className="p-3 rounded-full bg-gray-700">
            {isCameraEnabled ? <Video size={24} color="white" /> : <VideoOff size={24} color="white" />}
          </button>
        </div>
      </div>
    </div>
  );
};

VideoCallModal.propTypes = {
  call: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VideoCallModal;