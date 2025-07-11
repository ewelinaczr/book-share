"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/api/userApi";
import { validateEmail } from "../../../shared/validators/emailValidator";
import { validatePassword } from "../../../shared/validators/passwordValidator";

import Input from "@/components/inputs/Input";

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LogInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();
  const [formError, setFormError] = useState("");
  const [login] = useLoginMutation();
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data).unwrap();
      router.push("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      setFormError(error?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <div>{formError ? <p>{formError}</p> : null}</div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
