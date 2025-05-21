"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import API from "../api"
import { useParams } from "react-router-dom"
import { Toaster, toast } from "sonner"
import { FilePlus, UploadCloud, FileText, ExternalLink, Loader2, File, X, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

const PortalDocuments = () => {
  const [session, setSession] = useState(null)
  const [portalDetails, setPortalDetails] = useState(null)
  const [documents, setDocuments] = useState([])
  const [newDocumentName, setNewDocumentName] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const { portalid } = useParams()

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem("session")
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession)
      setSession(parsedSession)
    }
  }, [])

  // Fetch portal details using the portalId
  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        const token = session?.token
        if (!portalid) {
          console.error("No portalId found in URL.")
          setLoading(false)
          return
        }

        // Fetch portal details using the /:portalId route
        const portalResponse = await API.get(`/portal/${portalid}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const portalData = portalResponse.data

        // Set portal details
        setPortalDetails(portalData)
      } catch (error) {
        console.error("Error fetching portal details:", error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    if (session && portalid) fetchPortalData()
  }, [session, portalid])

  // Fetch documents for the current portal
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!portalDetails || !session) return

      try {
        const token = session.token
        const { studentId, mentorId } = portalDetails

        // Dynamically determine the sender and receiver IDs based on the user's role
        let studentUserId, mentorUserId
        if (session.role === "student") {
          studentUserId = studentId._id
          mentorUserId = mentorId._id
        } else if (session.role === "mentor") {
          studentUserId = studentId._id
          mentorUserId = mentorId._id
        }

        // Fetch documents for the specified mentor-student pair
        const response = await API.get("/document", {
          params: {
            studentId: studentUserId,
            mentorId: mentorUserId,
          },
          headers: { Authorization: `Bearer ${token}` },
        })

        setDocuments(response.data.documents)
      } catch (error) {
        console.error("Error fetching documents:", error.response?.data || error.message)
      }
    }

    if (portalDetails && session) fetchDocuments()
  }, [portalDetails, session])

  // Handle document upload
  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !newDocumentName) {
      toast.error("Please provide both a document name and file.")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("studentId", portalDetails.studentId._id)
      formData.append("mentorId", portalDetails.mentorId._id)
      formData.append("documentName", newDocumentName)

      const token = session.token

      // Upload the document
      const response = await API.post("/document/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Add the new document to the state
      setDocuments((prevDocuments) => [...prevDocuments, response.data.document])
      setNewDocumentName("")
      setFile(null)
      toast.success("Document uploaded successfully!")
    } catch (error) {
      console.error("Error uploading document:", error.response?.data || error.message)
      toast.error("Failed to upload document.")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Auto-fill document name if not already set
      if (!newDocumentName) {
        setNewDocumentName(selectedFile.name.split(".")[0])
      }
    }
  }

  const openPreview = (document) => {
    setSelectedDocument(document)
    setPreviewOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-lg font-medium text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  if (!portalDetails) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="text-center text-gray-500 max-w-md">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Portal Details</h3>
          <p>No portal details available. Please connect with a mentor/student.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              {session.role === "student"
                ? "Upload and manage documents shared with your mentor."
                : "View documents uploaded by your student."}
            </p>
          </div>
        </div>

        {/* Document Upload Form (Only for Students) */}
        {session.role === "student" && (
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-primary" />
                Upload New Document
              </CardTitle>
              <CardDescription>Share important documents with your mentor</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="document-name">Document Name</Label>
                    <Input
                      id="document-name"
                      type="text"
                      value={newDocumentName}
                      onChange={(e) => setNewDocumentName(e.target.value)}
                      placeholder="Enter document name"
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file-upload">File</Label>
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="file-upload"
                        className={`flex items-center justify-center gap-2 flex-1 p-3 border rounded-lg cursor-pointer transition-colors ${
                          file ? "bg-primary/10 border-primary" : "hover:bg-gray-100"
                        }`}
                      >
                        {file ? (
                          <>
                            <Check className="h-5 w-5 text-primary" />
                            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="h-5 w-5 text-primary" />
                            <span>Choose File</span>
                          </>
                        )}
                      </label>
                      <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" required />
                      {file && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setFile(null)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="mt-4" disabled={uploading || !file || !newDocumentName}>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Document List */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <FilePlus className="h-5 w-5 text-primary" />
              Document Library
            </CardTitle>
            <CardDescription>
              {documents.length === 0
                ? "No documents have been uploaded yet."
                : `${documents.length} document${documents.length !== 1 ? "s" : ""} available`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence>
              {documents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Documents Yet</h3>
                  <p className="text-gray-500 max-w-md">
                    {session.role === "student"
                      ? "Upload your first document to share with your mentor."
                      : "Your student hasn't uploaded any documents yet."}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <motion.div
                      key={doc._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="group"
                    >
                      <Card className="overflow-hidden border transition-all duration-300 hover:shadow-md group-hover:border-primary/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <File className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{doc.documentName}</CardTitle>
                                <CardDescription className="text-xs">
                                  Uploaded on{" "}
                                  {new Date(doc.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="pt-0 pb-3 flex justify-between">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => openPreview(doc)}>
                            <FileText className="h-4 w-4" />
                            Preview
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.documentName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <iframe
              src={selectedDocument?.documentUrl}
              title={selectedDocument?.documentName}
              className="w-full h-[600px] border rounded-lg"
            ></iframe>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <a
              href={selectedDocument?.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PortalDocuments
