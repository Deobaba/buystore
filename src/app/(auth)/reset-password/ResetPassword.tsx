"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordData } from "@/validation/auth";
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
const ResetPassword = () => {

  const [isLoading, setIsLoading] = useState(false);
  
    const form = useForm<ResetPasswordData>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
        code: "",
        email: "",
        password: "",
      },
    });
  
    const handleSubmit = async (data: ResetPasswordData) => {
      setIsLoading(true);
  
      try {
        const response = await fetch("/api/forgot-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Reset Passord failed");
        }
  
        const responseData = await response.json();
        console.log("Password reset successful:", responseData);
  
        // Show success toast
        toast.success("Password resetted successfully.");
  
        // Redirect to dashboard after a delay
        setTimeout(() => {
          window.location.href = "/signin";
        }, 500);
      } catch (error: any) {
        console.error("Reset password error:", error.message);
        //alert(error.message || "An error occurred during sign-in");
        toast.error(error.message || "An error occurred while resetting password.");
      } finally {
        setIsLoading(false);
      }
    };
  

  return (
    <div className="flex flex-col justify-center items-center mt-20 max-w-md mx-auto border rounded-lg p-6 md:p-12 shadow-md bg-white">
      <Image
        src="/assets/images/Logo3.jpg"
        alt="buystore Logo"
        width={80}
        height={80}
        className="mb-5"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <h2 className="text-2xl text-center mb-4">Reset Password</h2>

          {/* reset code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="number"
                    placeholder="Enter reset code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="password"
                    placeholder="Enter your password"
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
                <span>Resetting Password...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ResetPassword
