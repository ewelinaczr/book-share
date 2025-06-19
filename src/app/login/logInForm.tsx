"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../../api/loginApi";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    setFormError("");
    try {
      await loginUser(data);
      router.push("/");
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          {...register("password", { required: "Password is required" })}
          error={errors.password?.message}
        />
        {formError && <div>{formError}</div>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
