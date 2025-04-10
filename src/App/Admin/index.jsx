import { Routes, Route } from "react-router-dom"
import AdminLayout from "./AdminLayout"
import AdminHomepage from "./AdminHomepage"
import AdminUniversities from "./AdminUniversities"
import AdminMentorAffiliations from "./AdminMentorAffiliations"
import AdminDiscussionRoom from "./AdminDiscussionRoom"
import AdminUsers from "./AdminUsers"

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminHomepage />} />
        <Route path="universities" element={<AdminUniversities />} />
        <Route path="affiliations" element={<AdminMentorAffiliations />} />
        <Route path="discussion-rooms" element={<AdminDiscussionRoom />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  )
}
