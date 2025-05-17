import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageSquare, Video } from 'lucide-react';
import { useCallContext } from '../contexts/CallContext';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portalDetails, setPortalDetails] = useState(null);

  const { portalid } = useParams();
  const chatContainerRef = useRef(null);
  const messagesRef = useRef(messages);
  const { client } = useCallContext();

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
        const token = session?.token;
        if (!portalid) {
          console.error('No portalId found in URL.');
          setLoading(false);
          return;
        }

        const portalResponse = await API.get(`/portal/${portalid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const portalData = portalResponse.data;
        setPortalDetails(portalData);
      } catch (error) {
        console.error('Error fetching portal details:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPortalData();
  }, [portalid, session]);

  // Initialize Socket.IO connection and handle incoming messages
  useEffect(() => {
    if (!session || !portalDetails) return;

    const { studentId, mentorId } = portalDetails;

    let senderId, senderRole;
    if (session.role === 'student') {
      senderId = studentId._id;
      senderRole = 'Student';
    } else if (session.role === 'mentor') {
      senderId = mentorId._id;
      senderRole = 'Mentor';
    }

    if (socket) {
      socket.disconnect();
    }

    const socketInstance = io('http://localhost:5000', {
      query: { userId: senderId, userRole: senderRole },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on('receiveMessage', (message) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg._id === message._id)) {
          return [...prevMessages, { ...message, message: message.content }];
        }
        return prevMessages;
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [session, portalDetails]);

  // Fetch chat history
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
  }, [session, portalDetails]);

  // Scroll to the bottom of the chat container when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to send a new message
  const sendMessage = async (messageContent) => {
    const messageToSend = messageContent || newMessage;
    if (!messageToSend.trim() || !session || !portalDetails) return;

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
        content: messageToSend,
      });

      // Update local state immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: Date.now(),
          senderId,
          senderRole,
          message: messageToSend,
        },
      ]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  // Function to start a video call
  const startVideoCall = async (recipientId) => {
    if (!client) {
      console.error('StreamVideoClient is not initialized');
      return;
    }

    try {
      const newCall = client.call('default', `call-${Date.now()}`);
      await newCall.getOrCreate({
        data: { 
          custom: {
            uniguideCall: true,
            participants: [session._id, recipientId]
          }
        }
      });

      // Send the call link to the chat
      const callUrl = `/call/${newCall.id}`;
      sendMessage(`Join the call: ${window.location.origin}${callUrl}`);
    } catch (error) {
      console.error('Error starting video call:', error);
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
    <>
      <Card className="max-w-7xl mx-auto shadow-lg">
        {/* Header */}
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg font-semibold">Chat</CardTitle>
            </div>
            <div>
              {/* Video call button */}
              <button
                onClick={() => {
                  // Get the correct recipient ID based on current user role
                  if (portalDetails) {
                    const { studentId, mentorId } = portalDetails;
                    const recipientId = session.role === 'student' ? mentorId._id : studentId._id;
                    startVideoCall(recipientId);
                  }
                }}
                className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors"
                title="Start video call"
              >
                <Video className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </CardHeader>

        {/* Chat Content */}
        <CardContent className="p-0">
          <div className="flex flex-col h-[570px] bg-gray-100 border rounded-lg overflow-hidden">
            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isCallLink = msg.message.startsWith('Join the call:');
                  return (
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
                      {isCallLink ? (
                        <a
                          href={msg.message.replace('Join the call: ', '')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 underline"
                        >
                          {msg.message}
                        </a>
                      ) : (
                        <p className="text-sm">{msg.message}</p>
                      )}
                    </div>
                  );
                })
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
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
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
    </>
  );
};

export default Chat;
