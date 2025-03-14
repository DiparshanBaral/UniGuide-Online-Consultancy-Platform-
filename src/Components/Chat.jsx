import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import API from '../api';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [portalDetails, setPortalDetails] = useState(null);
  const { portalid } = useParams(); // Extract portalId from URL params

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setSession(parsedSession);
    }
  }, []);

  // Fetch portal details using the portalId
  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        const token = session?.token; // Extract token from session
        console.log('Token:', token);

        if (!portalid) {
          console.error('No portalId found in URL.');
          setLoading(false);
          return;
        }

        // Fetch portal details using the /:portalId route
        const portalResponse = await API.get(`/portal/${portalid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const portalData = portalResponse.data;

        // Set portal details
        setPortalDetails(portalData);
        console.log('Fetched Portal Details:', portalData);
      } catch (error) {
        console.error('Error fetching portal details:', error.response?.data || error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPortalData();
  }, [portalid, session]);

  // Initialize WebSocket connection and fetch chat history
  useEffect(() => {
    let ws; // Declare WebSocket outside the function scope

    const initializeChat = async () => {
      if (!session || !portalDetails) return;

      const { studentId, mentorId } = portalDetails;

      // Determine sender and receiver
      let senderId, senderRole, receiverId, receiverRole;
      if (session.role === 'student') {
        senderId = studentId._id;
        senderRole = 'Student';
        receiverId = mentorId._id;
        receiverRole = 'Mentor';
      } else if (session.role === 'mentor') {
        senderId = mentorId._id;
        senderRole = 'Mentor';
        receiverId = studentId._id;
        receiverRole = 'Student';
      }

      console.log('Initializing Chat with:', { senderId, senderRole, receiverId, receiverRole });

      // Close any existing WebSocket connection
      if (ws) {
        ws.close();
      }

      // Initialize WebSocket connection
      ws = new WebSocket(
        `ws://localhost:8080?userId=${senderId}&userRole=${senderRole}`
      );
      setSocket(ws);

      // Handle incoming messages via WebSocket
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received Message:', message);

        // Check if the message is already in the state
        if (!messages.some((msg) => msg._id === message._id)) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };

      // Fetch chat history
      try {
        const chatHistoryResponse = await API.get('/chat/history', {
          params: {
            userId: senderId,
            userRole: senderRole,
            otherUserId: receiverId,
            otherUserRole: receiverRole,
          },
        });
        console.log('Fetched Chat History:', chatHistoryResponse.data.messages);

        // Set chat history without duplicates
        setMessages(chatHistoryResponse.data.messages);
      } catch (error) {
        console.error('Error fetching chat history:', error.response?.data || error.message);
      }
    };

    initializeChat();

    // Cleanup function to close WebSocket on unmount
    return () => {
      if (ws) {
        ws.close();
        console.log('WebSocket connection closed.');
      }
    };
  }, [session, portalDetails]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !session || !portalDetails) return;

    const { studentId, mentorId } = portalDetails;

    // Determine sender and receiver
    let senderId, senderRole, receiverId, receiverRole;
    if (session.role === 'student') {
      senderId = studentId._id;
      senderRole = 'Student';
      receiverId = mentorId._id;
      receiverRole = 'Mentor';
    } else if (session.role === 'mentor') {
      senderId = mentorId._id;
      senderRole = 'Mentor';
      receiverId = studentId._id;
      receiverRole = 'Student';
    }

    try {
      console.log('Sending Message:', {
        senderId,
        senderRole,
        receiverId,
        receiverRole,
        content: newMessage,
      });

      // Save message to the database
      const response = await API.post('/chat/send', {
        senderId,
        senderRole,
        receiverId,
        receiverRole,
        content: newMessage,
      });

      // Send message via WebSocket
      socket.send(
        JSON.stringify({
          _id: response.data._id, // Include the unique ID of the message
          receiverId,
          receiverRole,
          content: newMessage,
        })
      );

      // Update local state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: response.data._id, // Include the unique ID of the message
          senderId,
          senderRole,
          message: newMessage,
        },
      ]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  // If still loading, show a placeholder
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // If no portal details are found, show a fallback message
  if (!portalDetails) {
    return <div className="text-center text-gray-500">No chat available. Please connect with a mentor/student.</div>;
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          Chat with{' '}
          {session.role === 'student'
            ? `${portalDetails.mentorId.firstname} ${portalDetails.mentorId.lastname}`
            : `${portalDetails.studentId.firstname} ${portalDetails.studentId.lastname}`}
        </CardTitle>
        <CardDescription>Communicate with your student/mentor through chat.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg._id || index} // Use _id as the unique key
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.senderId === session._id
                      ? 'ml-auto bg-blue-500 text-white' // Align right for current user
                      : 'bg-gray-200' // Align left for other user
                  }`}
                >
                  <p className="text-sm font-medium">{msg.message}</p> {/* Use 'message' here */}
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="flex items-center p-4 border-t">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
            >
              Send
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;