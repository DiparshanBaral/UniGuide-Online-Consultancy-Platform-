import { useState, useEffect } from 'react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Users, MessageSquare, Plus, TrendingUp } from 'lucide-react';
import { CreateRoom } from '@/Components/create-room';
import API from '../api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function DiscussionRooms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [rooms, setRooms] = useState([]); // State to store fetched rooms
  const [joinedRooms, setJoinedRooms] = useState([]); // State to store joined rooms
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  // Retrieve session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      setSession(JSON.parse(savedSession)); // Set session from localStorage if it exists
    }
  }, []);
  // Fetch all rooms from the backend API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await API.get('/discussion/rooms'); // Replace with your API endpoint
        if (!response.data.success) {
          throw new Error('Failed to fetch rooms');
        }
        setRooms(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Fetch joined rooms for the logged-in user
  useEffect(() => {
    const fetchJoinedRooms = async () => {
      try {
        const response = await API.get(`/discussion/joined?userId=${session._id}`, {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });

        // Check if the response contains data
        if (!response.data.success) {
          console.error('API Error:', response.data.message || 'Failed to fetch joined rooms');
          toast.error('Failed to fetch joined rooms. Please try again.');
          return;
        }
        // Update the state with the fetched rooms
        setJoinedRooms(response.data.data);
      } catch (error) {
        console.error('Error fetching joined rooms:', error.message);
      }
    };
    fetchJoinedRooms();
  }, [session]);

  // Handle room creation
  const handleCreateRoom = async (roomData) => {
    try {
      const response = await API.post('/discussion/create', roomData, {
        headers: {
          Authorization: `Bearer ${session?.token}`, // Add token to headers
        },
      });
      if (!response.data.success) {
        throw new Error('Failed to create room');
      }else{
        toast.success("Room created successfully. Waiting for admin's approval!")
      };
      setShowCreateRoom(false); // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    }
  };

  // Handle joining a room
  const handleJoinRoom = async (roomId) => {
    try {
      const response = await API.post(
        `/discussion/${roomId}/join`,
        { userId: session?._id },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`, // Add token to headers
          },
        },
      );
      if (!response.data.success) {
        throw new Error('Failed to join room');
      }

      // Show success toast notification
      toast.success('Successfully joined the room!', {
        description: 'You are now part of this discussion room.',
        duration: 3000, // Duration in milliseconds
      });

      // Update the joinedRooms state
      setJoinedRooms((prev) => [...prev, response.data.data]);
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
    }
  };

  // Filter rooms based on search query
  const filteredRooms = rooms.filter(
    (room) =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Get activity color for visual representation
  const getActivityColor = (activity) => {
    switch (activity) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  // Define categories dynamically based on room data
  const categories = [
    { id: 'general', name: 'General' },
    { id: 'joined', name: 'Joined Rooms' },
  ];

  return (
    <div className="mt-[30px] min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      {/* Hero Section with Search */}
      <div className="relative bg-primary text-primary-foreground py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="md:max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Discussion Rooms</h1>
              <p className="text-lg opacity-90 mb-6">
                Connect with peers, mentors, and experts in our vibrant discussion rooms. Share
                ideas, collaborate, and grow together.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => setShowCreateRoom(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Room
                </Button>
                <Button variant="secondary" size="lg">
                  <TrendingUp className="mr-2 h-4 w-4" /> Trending Rooms
                </Button>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Input
                  placeholder="Search rooms..."
                  className="bg-primary-foreground/10 border-primary-foreground/20 placeholder:text-primary-foreground/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Rooms Grid with Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-2 w-full md:w-auto mb-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="general" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p>Loading rooms...</p> // Display loading message while fetching data
              ) : filteredRooms.length > 0 ? (
                filteredRooms.map((room, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{room.title}</CardTitle>
                        <div
                          className={`w-3 h-3 rounded-full ${getActivityColor(room.activity)}`}
                          title={`${room.activity} activity`}
                        ></div>
                      </div>
                      <CardDescription>{room.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{room.participants} participants</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleJoinRoom(room._id)} // Join room button
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Join Room
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p>No rooms found.</p> // Display message if no rooms match the filter
              )}
            </div>
          </TabsContent>
          <TabsContent value="joined" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedRooms.length > 0 ? (
                joinedRooms.map((room, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{room.title}</CardTitle>
                        <div
                          className={`w-3 h-3 rounded-full ${getActivityColor(room.activity)}`}
                          title={`${room.activity} activity`}
                        ></div>
                      </div>
                      <CardDescription>{room.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{room.participants} participants</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => navigate(`/discussionroom/${room._id}`)} // Navigate to room page
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Enter Room
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p>No joined rooms found.</p> // Display message if no joined rooms
              )}
            </div>
          </TabsContent>
        </Tabs>
        {/* Benefits Section */}
        <section className="mt-20 bg-slate-100 rounded-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-center mb-8">Why Join Discussion Rooms?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect with Peers</h3>
              <p className="text-muted-foreground">
                Build relationships with like-minded students and professionals from around the
                world.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Exchange Knowledge</h3>
              <p className="text-muted-foreground">
                Share your expertise and learn from others in collaborative discussion environments.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Grow Together</h3>
              <p className="text-muted-foreground">
                Accelerate your personal and professional growth through community support and
                feedback.
              </p>
            </div>
          </div>
        </section>
      </div>
      {/* Create Room Dialog */}
      {showCreateRoom && (
        <CreateRoom onClose={() => setShowCreateRoom(false)} onSubmit={handleCreateRoom} />
      )}
    </div>
  );
}
