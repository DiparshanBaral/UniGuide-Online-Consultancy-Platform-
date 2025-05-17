import { ParticipantView, useCallStateHooks } from '@stream-io/video-react-sdk';

const MyParticipantList = () => {
  const { useRemoteParticipants } = useCallStateHooks();
  const remoteParticipants = useRemoteParticipants();

  return (
    <div className="flex flex-wrap gap-4">
      {remoteParticipants.map((participant) => (
        <ParticipantView participant={participant} key={participant.sessionId} />
      ))}
    </div>
  );
};

export default MyParticipantList;