import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getStreamVideoClient } from '../utils/streamVideoClient';

const CallContext = createContext();

export const useCallContext = () => useContext(CallContext);

export const CallProvider = ({ children, session }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (!session || !session.token || !session._id) {
      console.error('Session data is missing or invalid:', session);
      setLoading(false);
      return;
    }

    const initializeClient = async () => {
      try {
        console.log('Initializing StreamVideoClient with session:', session);

        // Fetch the token from the backend
        const response = await fetch(
          // `http://localhost:5000/auth/stream-token?userId=${session._id}&userName=${session.firstname} ${session.lastname}`
          `https://uni-guide-frontend.vercel.app/auth/stream-token?userId=${session._id}&userName=${session.firstname} ${session.lastname}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Stream token');
        }

        const { token } = await response.json();
        console.log('Fetched Stream token:', token);

        // Initialize the StreamVideoClient
        const clientInstance = getStreamVideoClient({
          apiKey: 'fr33gkj4t94h',
          user: {
            id: session._id,
            name: `${session.firstname} ${session.lastname}`,
          },
          token,
        });

        // Listen for incoming calls
        clientInstance.on('call.incoming', (call) => {
          console.log('Incoming call:', call);
          setIncomingCall(call);
        });

        console.log('StreamVideoClient initialized successfully');
        setClient(clientInstance);
      } catch (error) {
        console.error('Error initializing Stream Video Client:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeClient();
  }, [session]);

  if (loading) return <div>Loading...</div>;

  return (
    <CallContext.Provider value={{ client, incomingCall, setIncomingCall }}>
      {children}
    </CallContext.Provider>
  );
};

CallProvider.propTypes = {
  children: PropTypes.node.isRequired,
  session: PropTypes.object.isRequired,
};