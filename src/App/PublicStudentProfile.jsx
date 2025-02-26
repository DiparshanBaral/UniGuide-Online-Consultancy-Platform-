import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const PublicStudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await API.get(`/student/public/${id}`, {
          withCredentials: true, // Ensures auth cookies are sent
        });
        setStudent(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center space-x-4">
        <img
          src={student.profilePic || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        <div>
          <h2 className="text-2xl font-bold">{student.firstname} {student.lastname}</h2>
          <p className="text-gray-600">{student.major || "Major not specified"}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Bio</h3>
        <p className="text-gray-700">{student.bio || "No bio available"}</p>
      </div>

      {/* Targeted Universities Section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Targeted Universities</h3>
        {student.targetedUniversities && student.targetedUniversities.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-700">
            {student.targetedUniversities.map((university, index) => (
              <li key={index}>{university}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No targeted universities added.</p>
        )}
      </div>
    </div>
  );
};

export default PublicStudentProfile;
