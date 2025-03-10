import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PublicStudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await API.get(`/student/public/${id}`, {
          withCredentials: true, // Include credentials in the request
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

  if (loading) {
    return (
      <div className="pt-[90px] min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[90px] min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-[60px] min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <section className="relative py-6 md:py-12 bg-gradient-to-b from-primary/5 to-background">
          <motion.div
            className="container px-4 md:px-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex flex-col items-center text-center space-y-4"
              variants={itemVariants}
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <img
                  src={student.profilePic || "/placeholder.svg"}
                  alt={`${student.firstname} ${student.lastname}`}
                  className="w-full h-full rounded-full object-cover border-4 border-background shadow-xl"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {student.firstname} {student.lastname}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Major: {student.major || "Not specified"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <motion.div
            className="container px-4 md:px-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Bio */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="size-5" />
                    Bio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {student.bio || "No bio available."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Targeted Universities */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Targeted Universities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {student.targetedUniversities && student.targetedUniversities.length > 0 ? (
                      student.targetedUniversities.map((university, index) => (
                        <span key={index} className="text-sm text-muted-foreground">
                          {university}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No targeted universities.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default PublicStudentProfile;