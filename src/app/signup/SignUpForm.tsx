"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signupUser } from "../../api/signupApi";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const onSubmit = async (data: SignupFormInputs) => {
    setFormError("");
    try {
      await signupUser(data);
      router.push("/");
    } catch (err: any) {
      setFormError(err.message);
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
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
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
              value === password || "Passwords do not match!",
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
