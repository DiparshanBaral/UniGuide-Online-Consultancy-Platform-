"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, GraduationCap, MessageSquare, Users } from "lucide-react";
import API from "@/api";

export default function AdminHomepage() {
  const [stats, setStats] = useState({
    universities: 0,
    mentors: 0,
    students: 0,
    discussionRooms: 0,
    pendingAffiliations: 0,
    pendingRooms: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch counts for universities, mentors, students, and discussion rooms
  const fetchCounts = async () => {
    try {
      const response = await API.get("/admin/counts");
      if (response.data.success) {
        const { universityCount, mentorCount, studentCount, discussionRoomCount } = response.data.data;
        setStats((prevStats) => ({
          ...prevStats,
          universities: universityCount,
          mentors: mentorCount,
          students: studentCount,
          discussionRooms: discussionRoomCount,
        }));
      } else {
        console.error("Failed to fetch counts:", response);
      }
    } catch (error) {
      console.error("Error fetching counts:", error.message);
    }
  };

  // Fetch pending mentor affiliations count
  const fetchPendingAffiliations = async () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      const token = sessionData ? sessionData.token : null;

      if (!token) throw new Error("No token found");

      const response = await API.get("/affiliations/pendingrequests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats((prevStats) => ({
        ...prevStats,
        pendingAffiliations: response.data.length || 0,
      }));
    } catch (error) {
      console.error("Error fetching pending affiliations:", error.message);
    }
  };

  // Fetch pending discussion rooms count
  const fetchPendingRooms = async () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      const token = sessionData ? sessionData.token : null;

      if (!token) throw new Error("No token found");

      const response = await API.get("/discussion/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats((prevStats) => ({
        ...prevStats,
        pendingRooms: response.data.data.length || 0,
      }));
    } catch (error) {
      console.error("Error fetching pending rooms:", error.message);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCounts(), fetchPendingAffiliations(), fetchPendingRooms()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your admin dashboard.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Universities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.universities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Registered Mentors</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mentors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Registered Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Discussion Rooms</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.discussionRooms}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Mentor Affiliations</span>
                </div>
                <Badge variant="secondary">{stats.pendingAffiliations}</Badge>
              </div>
              <Progress value={(stats.pendingAffiliations / 20) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Discussion Rooms</span>
                </div>
                <Badge variant="secondary">{stats.pendingRooms}</Badge>
              </div>
              <Progress value={(stats.pendingRooms / 20) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
