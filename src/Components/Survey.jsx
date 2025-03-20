"use client";

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
  FormDescription,
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

export default function UniversitySurveyForm({ onSubmit }) {
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page of the form
  const [acceptanceRange, setAcceptanceRange] = useState([50, 70]);
  const [graduationRange, setGraduationRange] = useState([80, 100]);

  // Define validation schema using yup
  const schema = yup.object().shape({
    country: yup.string().required("Country is required"),
    fieldOfStudy: yup.string().required("Field of Study is required"),
    budget: yup.string().required("Budget Range is required"),
  });

  const form = useForm({
    defaultValues: {
      country: "",
      fieldOfStudy: "",
      budget: "",
      acceptanceRate: acceptanceRange,
      graduationRate: graduationRange,
    },
    resolver: yupResolver(schema), // Use yupResolver here
  });

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      console.log("Survey values submitted:", values);

      // Validate required fields
      if (!values.country || !values.fieldOfStudy || !values.budget) {
        alert("Please fill in all required fields.");
        return;
      }

      // Format the acceptance rate range and graduation rate range for the backend
      const formattedValues = {
        ...values,
        acceptanceRate: values.acceptanceRate.join("&apos;-&apos;"), // Convert array to string
        graduationRate: values.graduationRate.join("&apos;-&apos;"), // Convert array to string
      };

      // Send the survey data to the backend
      const response = await API.post("/universities/survey", formattedValues);

      // Log the results from the backend
      console.log("Survey results:", response.data);

      // Call the parent onSubmit handler
      onSubmit(response.data);
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
                        <FormLabel className="text-black">Country Preference</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your preferred country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose the country where you&apos;d like to pursue your studies</FormDescription>
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
                        <FormLabel className="text-black">Field of Study</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your field of study" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Arts &amp; Design">Arts &amp; Design</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the academic field you&apos;re interested in studying</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Budget Range */}
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Budget Range</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your budget range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">$10k - $20k</SelectItem>
                            <SelectItem value="medium">$20k - $35k</SelectItem>
                            <SelectItem value="high">$35k+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose your preferred annual tuition fee range</FormDescription>
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
                    name="acceptanceRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Acceptance Rate Range (%)</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="pt-6 px-1">
                              <Slider
                                defaultValue={acceptanceRange}
                                max={100}
                                min={0}
                                step={1}
                                onValueChange={(value) => {
                                  setAcceptanceRange(value);
                                  field.onChange(value);
                                }}
                                className="relative"
                              />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{acceptanceRange[0]}%</span>
                              <span>{acceptanceRange[1]}%</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>Select your preferred university acceptance rate range</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Graduation Rate Range */}
                  <FormField
                    control={form.control}
                    name="graduationRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Rate Range (%)</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="pt-6 px-1">
                              <Slider
                                defaultValue={graduationRange}
                                max={100}
                                min={0}
                                step={1}
                                onValueChange={(value) => {
                                  setGraduationRange(value);
                                  field.onChange(value);
                                }}
                                className="relative"
                              />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{graduationRange[0]}%</span>
                              <span>{graduationRange[1]}%</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>Select your preferred university graduation rate range</FormDescription>
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
            <Button
              variant="outline"
              onClick={() => setCurrentPage(1)}
              className="w-32"
            >
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
};