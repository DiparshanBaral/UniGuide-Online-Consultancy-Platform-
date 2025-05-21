import { useState } from "react"
import { motion } from "framer-motion"
import PropTypes from "prop-types"
import { toast } from "sonner"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion"
import { Sparkles, Mail, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react"
import API from "../api"

// Feature Item Component with prop validation
const FeatureItem = ({ children }) => {
  return (
    <motion.li
      className="flex items-start space-x-3"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <p className="text-gray-700">{children}</p>
    </motion.li>
  )
}

FeatureItem.propTypes = {
  children: PropTypes.node.isRequired,
}

// Contact Card Component with prop validation
const ContactCard = ({ icon: Icon, title, description, value }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full hover:shadow-md transition-all duration-300 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-3">{description}</p>
            <p className="text-primary font-medium">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

ContactCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

// Section Header Component with prop validation
const SectionHeader = ({ title, className = "" }) => {
  return (
    <motion.div
      className={`mb-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <div className="h-1 w-20 bg-primary/70 mt-2 rounded-full"></div>
    </motion.div>
  )
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
}

function Aboutus() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await API.post("/contact/send", formData)

      if (response.data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
        })
      } else {
        toast.error(response.data.message || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending contact form:", error)
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.header className="mb-16 text-center" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} className="mb-4">
            <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Our Story
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About UniGuide</h1>
          </motion.div>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-3xl mx-auto">
            Empowering students and mentors with a seamless online consultancy platform for academic excellence.
          </motion.p>
        </motion.header>

        {/* Mission Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionHeader title="Our Mission" />
          <Card className="border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="pt-6">
              <p className="leading-relaxed text-gray-700">
                At UniGuide, our mission is to bridge the gap between students and mentors by providing an accessible
                and efficient platform for guidance, support, and growth. We aim to foster academic success through
                effective communication and personalized mentorship.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionHeader title="What We Offer" />
          <Card className="border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="pt-6">
              <ul className="space-y-5">
                <FeatureItem>
                  A platform for students to connect with experienced mentors for tailored guidance.
                </FeatureItem>
                <FeatureItem>
                  Resources and tools to prepare for exams like IELTS and enhance academic skills.
                </FeatureItem>
                <FeatureItem>Collaborative discussion rooms to promote shared learning experiences.</FeatureItem>
                <FeatureItem>A user-friendly interface for seamless navigation and interaction.</FeatureItem>
              </ul>
            </CardContent>
          </Card>
        </motion.section>

        {/* Vision Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionHeader title="Our Vision" />
          <Card className="border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="pt-6">
              <p className="leading-relaxed text-gray-700">
                We envision a world where every student has the opportunity to achieve their academic and professional
                dreams with the guidance of a trusted mentor. UniGuide strives to be the platform that makes this vision
                a reality.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Contact Us Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionHeader title="Contact Us" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="border-gray-200 hover:shadow-md transition-all duration-300 h-full">
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we&apos;ll get back to you soon.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="border-gray-200 focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="border-gray-200 focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Your Queries
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Type your queries or feedback here..."
                        className="border-gray-200 focus:border-primary"
                        required
                      />
                    </div>
                    <div className="pt-2">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-6">
              <ContactCard
                icon={Mail}
                title="Email Us"
                description="Reach us via email:"
                value="uniguideonlineconsultancy@gmail.com"
              />
              <ContactCard icon={Phone} title="Call Us" description="Speak to us directly:" value="+977 9818601909" />
              <ContactCard
                icon={MapPin}
                title="Visit Us"
                description="Our office address:"
                value="P86J+W8X, Kathmandu 44600"
              />
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionHeader title="Frequently Asked Questions" />
          <Card className="border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-gray-800 font-medium">How do I create an account?</AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    To create an account, click on the &quot;Login&quot; button on the top-right navbar, then go to
                    signup page from there and fill in your details, and submit.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-gray-800 font-medium">
                    What services does UniGuide offer?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    UniGuide provides mentorship, resources for exams like IELTS, and collaborative discussion rooms.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-gray-800 font-medium">How do I contact a mentor?</AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    You can contact mentors through our platform by navigating to the &quot;Universities&quot; section
                    and find mentors according to university of your choice.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}

export default Aboutus
