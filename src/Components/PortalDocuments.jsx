import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/card';
import API from '../api';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner'; // Import Sonner for toasts
import { FilePlus, UploadCloud } from 'lucide-react'; // Import LucideReact icons
import { Dialog, DialogContent, DialogTrigger } from '@/Components/ui/dialog'; // Import Shadcn Dialog for preview

const PortalDocuments = () => {
  const [session, setSession] = useState(null);
  const [portalDetails, setPortalDetails] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

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

    if (session && portalid) fetchPortalData();
  }, [session, portalid]);

  // Fetch documents for the current portal
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!portalDetails || !session) return;

      try {
        const token = session.token;
        const { studentId, mentorId } = portalDetails;

        // Dynamically determine the sender and receiver IDs based on the user's role
        let studentUserId, mentorUserId;
        if (session.role === 'student') {
          studentUserId = studentId._id; // Logged-in user is the student
          mentorUserId = mentorId._id; // The mentor is the other user
        } else if (session.role === 'mentor') {
          studentUserId = studentId._id; // The student is the other user
          mentorUserId = mentorId._id; // Logged-in user is the mentor
        }

        // Log the query parameters for debugging
        console.log('Fetching documents for:', { studentId: studentUserId, mentorId: mentorUserId });

        // Fetch documents for the specified mentor-student pair
        const response = await API.get('/document', {
          params: {
            studentId: studentUserId,
            mentorId: mentorUserId,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        setDocuments(response.data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error.response?.data || error.message);
      }
    };

    if (portalDetails && session) fetchDocuments();
  }, [portalDetails, session]);

  // Handle document upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !newDocumentName) {
      toast.error('Please provide both a document name and file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentId', portalDetails.studentId._id);
      formData.append('mentorId', portalDetails.mentorId._id);
      formData.append('documentName', newDocumentName);

      const token = session.token;

      // Upload the document
      const response = await API.post('/document/upload', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Add the new document to the state
      setDocuments((prevDocuments) => [...prevDocuments, response.data.document]);
      setNewDocumentName('');
      setFile(null);
      toast.success('Document uploaded successfully!');
    } catch (error) {
      console.error('Error uploading document:', error.response?.data || error.message);
      toast.error('Failed to upload document.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!portalDetails) {
    return (
      <div className="text-center text-gray-500">
        No portal details available. Please connect with a mentor/student.
      </div>
    );
  }

  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePlus className="h-6 w-6 text-primary" />
            Documents
          </CardTitle>
          <CardDescription>
            {session.role === 'student'
              ? 'Upload and manage documents shared with your mentor.'
              : 'View documents uploaded by your student.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Document Upload Form (Only for Students) */}
          {session.role === 'student' && (
            <form onSubmit={handleUpload} className="mb-6">
              <div className="space-y-4">
                <input
                  type="text"
                  value={newDocumentName}
                  onChange={(e) => setNewDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <div className="flex gap-2 w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 flex-1 p-3 border rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <UploadCloud className="h-5 w-5 text-primary" />
                    Choose File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition-colors w-1/4"
                  >
                    Upload Document
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Display Documents */}
          <div>
            {documents.length === 0 ? (
              <p className="text-gray-500">No documents available.</p>
            ) : (
              <ul className="space-y-4">
                {documents.map((doc) => (
                  <li key={doc._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                    <div>
                      <p className="font-medium">{doc.documentName}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-600 transition-colors">
                          View Document
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <iframe
                          src={doc.documentUrl}
                          title={doc.documentName}
                          className="w-full h-[500px] border rounded-lg"
                        ></iframe>
                        <div className="mt-4 flex justify-end">
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            View on Full Page
                          </a>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PortalDocuments;