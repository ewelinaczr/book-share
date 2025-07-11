"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/api/userApi";
import { validateEmail } from "../../../shared/validators/emailValidator";
import { validatePassword } from "../../../shared/validators/passwordValidator";
import { confirmPassword } from "../../../shared/validators/passwordConfirmValidator";

import Input from "@/components/inputs/Input";

type SignupFormInputs = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>();
  const [formError, setFormError] = useState("");
  const [signup] = useSignupMutation();
  const router = useRouter();

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      await signup(data).unwrap();
      router.push("/");
    } catch (error: any) {
      console.error("Signup failed:", error);
      setFormError(error?.data?.message || "Signup failed. Please try again.");
    }
  };

  const password = watch("password");

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="name"
          label="Name"
          type="text"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          {...register("email", {
            required: "Email is required",
            validate: (value) => validateEmail(value) || "Invalid email format",
          })}
          error={errors.email?.message}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            validate: (value) =>
              validatePassword(value) ||
              "Password must be at least 8 characters long and contain letters and numbers",
          })}
          error={errors.password?.message}
        />
        <Input
          id="passwordConfirm"
          label="Confirm Password"
          type="password"
          {...register("passwordConfirm", {
            required: "Please confirm your password",
            validate: (value) =>
              confirmPassword(password, value) || "Passwords do not match",
          })}
          error={errors.passwordConfirm?.message}
        />
        {formError && <div>{formError}</div>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
