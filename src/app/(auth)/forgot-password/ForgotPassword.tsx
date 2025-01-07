'use client'

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordData } from "@/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const ForgotPassword = () => {

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
          email: "",
        },
      });

  const handleSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Unable to send reset password code.");
      }

      // Show success toast
      toast.success("A code has been sent to your mail to reset your password.");

      // Redirect to dashboard after a delay
      
    } catch (error: any) {
      console.error("Forgot-password error:", error.message);
      //alert(error.message || "An error occurred during sign-in");
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-20 max-w-md mx-auto border rounded-lg p-12 md:p-24 shadow-md bg-white">
      <Image
        src="/assets/images/Logo3.jpg"
        alt="SCAMalicious Logo"
        width={80}
        height={80}
        className="mb-5"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <h2 className="text-xl text-center mb-4">Forgot Password</h2>
          <p className="text-[12px] text-center mb-3">Enter your email in the field below to reset your password.</p>

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="email"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#350962]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="loader"></span>
                <span>Signing In...</span>
              </div>
            ) : (
              "Forgot Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;
