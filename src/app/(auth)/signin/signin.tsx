"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInData } from "@/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from 'next/image';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: SignInData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Sign-in failed");
      }

      const responseData = await response.json();
      console.log("Sign-in successful:", responseData);

      // Save token to local storage
      localStorage.setItem("authToken", responseData.token);

      // Show success toast
      toast.success("Login Successful.Welcome back!");

      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error: any) {
      console.error("Sign-in error:", error.message);
      //alert(error.message || "An error occurred during sign-in");
      toast.error(error.message || "An error occurred during sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-20 max-w-md mx-auto border rounded-lg p-12 md:p-24 shadow-md bg-white">
      <Image
        src="/assets/images/Logo3.jpg"
        alt="SCAMalicious Logo"
        width={100}
        height={100}
        className="mb-5"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <h2 className="text-2xl text-center mb-4">Sign In</h2>

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
          <Button type="submit" className="w-full bg-[#350962]" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="loader"></span>
                <span>Signing In...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Link to Signup */}
          <p className="text-center text-[12px]">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#E89217] hover:underline text-[14px]"
            >
              Create Account
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
