import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import API from "../api";

export default function UniversitySurveyForm({ onSubmit, onClose }) {
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page of the form
  const [acceptanceRange, setAcceptanceRange] = useState([50, 70]);
  const [graduationRange, setGraduationRange] = useState([80, 100]);

  // Define validation schema using yup
  const schema = yup.object().shape({
    country: yup.string().required("Country is required"),
    fieldOfStudy: yup.string().required("Field of Study is required"),
    budgetRange: yup.string().required("Budget Range is required"),
  });

  const form = useForm({
    defaultValues: {
      country: "",
      fieldOfStudy: "",
      budgetRange: "",
      acceptanceRateRange: acceptanceRange,
      graduationRateRange: graduationRange,
    },
    resolver: yupResolver(schema), // Use yupResolver here
    mode: "onChange", // Enable validation on change
  });

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      // Format the acceptance rate range and graduation rate range for the backend
      const formattedValues = {
        ...values,
        acceptanceRateRange: values.acceptanceRateRange.join("-"), // Convert array to string
        graduationRateRange: values.graduationRateRange.join("-"), // Convert array to string
      };

      // Send the survey data to the backend
      const response = await API.post("/universities/survey", formattedValues);

      // Call the parent onSubmit handler with the results
      onSubmit(response.data);

      // Close the survey dialog
      onClose();
    } catch (error) {
      console.error("Error submitting survey:", error.response?.data || error.message);
      alert("An error occurred while submitting the survey. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-6">
          <CardTitle className="text-2xl font-bold">Find Your Perfect University</CardTitle>
          <CardDescription className="text-primary-foreground/90 mt-2">
            Complete this survey to get personalized university recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Page 1: Country, Field of Study, Budget */}
              {currentPage === 1 && (
                <>
                  {/* Country Preference */}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="country" className="text-black">
                          Country Preference
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.trigger("country"); // Trigger validation
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger id="country" name="country">
                              <SelectValue placeholder="Select your preferred country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Field of Study */}
                  <FormField
                    control={form.control}
                    name="fieldOfStudy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="fieldOfStudy" className="text-black">
                          Field of Study
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.trigger("fieldOfStudy"); // Trigger validation
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger id="fieldOfStudy" name="fieldOfStudy">
                              <SelectValue placeholder="Select your field of study" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Arts & Design">Arts & Design</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Budget Range */}
                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="budgetRange" className="text-black">
                          Budget Range
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.trigger("budgetRange"); // Trigger validation
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger id="budgetRange" name="budgetRange">
                              <SelectValue placeholder="Select your budget range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">$10k - $20k</SelectItem>
                            <SelectItem value="medium">$20k - $35k</SelectItem>
                            <SelectItem value="high">$35k+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Page 2: Acceptance Rate and Graduation Rate */}
              {currentPage === 2 && (
                <>
                  {/* Acceptance Rate Range */}
                  <FormField
                    control={form.control}
                    name="acceptanceRateRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="acceptanceRateRange">Acceptance Rate Range (%)</FormLabel>
                        <FormControl>
                          <Slider
                            id="acceptanceRateRange"
                            name="acceptanceRateRange"
                            defaultValue={acceptanceRange}
                            max={100}
                            min={0}
                            step={1}
                            onValueChange={(value) => {
                              setAcceptanceRange(value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Graduation Rate Range */}
                  <FormField
                    control={form.control}
                    name="graduationRateRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="graduationRateRange">Graduation Rate Range (%)</FormLabel>
                        <FormControl>
                          <Slider
                            id="graduationRateRange"
                            name="graduationRateRange"
                            defaultValue={graduationRange}
                            max={100}
                            min={0}
                            step={1}
                            onValueChange={(value) => {
                              setGraduationRange(value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 rounded-b-lg flex justify-between">
          {/* Back Button */}
          {currentPage === 2 && (
            <Button variant="outline" onClick={() => setCurrentPage(1)} className="w-32">
              Back
            </Button>
          )}

          {/* Next or Submit Button */}
          {currentPage === 1 ? (
            <Button
              size="lg"
              className="w-full sm:w-32"
              onClick={() => {
                if (form.formState.isValid) {
                  setCurrentPage(2);
                } else {
                  alert("Please fill in all required fields on this page.");
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-32"
              onClick={form.handleSubmit(handleSubmit)}
            >
              Submit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// Props Validation
UniversitySurveyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired, // Add onClose prop validation
};