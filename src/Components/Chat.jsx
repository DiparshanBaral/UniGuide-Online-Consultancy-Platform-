import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client'; // Import Socket.IO client
import API from '../api';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageSquare } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [portalDetails, setPortalDetails] = useState(null);
  const { portalid } = useParams(); // Extract portalId from URL params

  // Reference to the chat container for scrolling
  const chatContainerRef = useRef(null);

  // Use a ref to track the latest value of `messages` without triggering re-renders
  const messagesRef = useRef(messages);

  // Update the ref whenever `messages` changes
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
      } catch (error) {
        console.error('Error fetching portal details:', error.response?.data || error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchPortalData();
  }, [portalid, session]);

  // Initialize Socket.IO connection and fetch chat history
  useEffect(() => {
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

    // Initialize Socket.IO connection
    const socketInstance = io('http://localhost:5000', {
      query: { userId: senderId, userRole: senderRole },
    });
    setSocket(socketInstance);

    // Handle incoming messages via Socket.IO
    socketInstance.on('receiveMessage', (message) => {
      if (!messages.some((msg) => msg._id === message._id)) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        const chatHistoryResponse = await API.get('/chat/history', {
          params: {
            userId: senderId,
            userRole: senderRole,
            otherUserId: receiverId,
            otherUserRole: receiverRole,
          },
        });
        setMessages(chatHistoryResponse.data.messages);
      } catch (error) {
        console.error('Error fetching chat history:', error.response?.data || error.message);
      }
    };

    fetchChatHistory();

    // Cleanup function to close Socket.IO connection on unmount
    return () => {
      socketInstance.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, portalDetails]);

  // Scroll to the bottom of the chat container when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
      // Emit the message via Socket.IO
      socket.emit('sendMessage', {
        receiverId,
        receiverRole,
        content: newMessage,
      });

      // Update local state immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: Date.now(), // Temporary ID until the server responds
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If no portal details are found, show a fallback message
  if (!portalDetails) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No chat available. Please connect with a mentor/student.
      </div>
    );
  }

  return (
    <Card className="max-w-7xl mx-auto shadow-lg"> {/* Increased width to max-w-5xl */}
      {/* Header */}
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg font-semibold">
            Chat 
          </CardTitle>
        </div>
      </CardHeader>
  
      {/* Chat Content */}
      <CardContent className="p-0">
        <div className="flex flex-col h-[570px] bg-gray-100 border rounded-lg overflow-hidden"> {/* Reduced height to h-[500px] */}
          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-2"
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`max-w-[70%] px-4 py-3 rounded-lg ${
                    msg.senderId === session._id
                      ? 'ml-auto bg-blue-500 text-white'
                      : 'mr-auto bg-gray-200 text-gray-800'
                  }`}
                  style={{
                    maxWidth: 'fit-content',
                    wordBreak: 'break-word',
                  }}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))
            )}
          </div>
  
          {/* Message Input */}
          <div className="flex items-center p-4 border-t border-gray-300 bg-white">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
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
