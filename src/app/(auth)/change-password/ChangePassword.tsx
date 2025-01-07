"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordData, changePasswordSchema } from "@/validation/auth";
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
const ChangePassword = () => {

  const [isLoading, setIsLoading] = useState(false);
  
    const form = useForm<ChangePasswordData>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
        email: "",
        oldPassword: "",
        newPassword: "",
      },
    });
  
    const handleSubmit = async (data: ChangePasswordData) => {
      setIsLoading(true);
  
      try {
        const response = await fetch("/api/change-password", {
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
        }, 1000);
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
        alt="SCAMalicious Logo"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="email"
                    placeholder="Enter old password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="password"
                    placeholder="Enter new password"
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
                <span>Changing Password...</span>
              </div>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ChangePassword

