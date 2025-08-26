"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/api/userApi";
import { validateEmail } from "../../../shared/validators/emailValidator";
import { validatePassword } from "../../../shared/validators/passwordValidator";
import { Pacifico } from "next/font/google";
import { SlKey } from "react-icons/sl";
import styles from "./LogInForm.module.css";

import Input from "@/components/inputs/Input";
import Button, { ButtonType } from "@/components/buttons/Button";
import Image from "next/image";

type LoginFormInputs = {
  email: string;
  password: string;
};

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

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
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src={"/reading1.jpg"}
          alt={"reading graphic"}
          width={410}
          height={410}
        />
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <p className={`${pacifico.className} ${styles.formTitle}`}>
            Log in to continue your reading journey
          </p>
          <Input
            id="email"
            label="E-mail address"
            type="email"
            placeholder="Enter your e-mail"
            icon={<span>@</span>}
            {...register("email", {
              required: "Email is required",
              validate: (value) =>
                validateEmail(value) || "Invalid email format",
            })}
            error={errors.email?.message}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<SlKey />}
            {...register("password", {
              required: "Password is required",
              validate: (value) =>
                validatePassword(value) ||
                "Password must be at least 8 characters long and contain letters and numbers",
            })}
            error={errors.password?.message}
          />
          <div className={styles.error}>
            {formError ? <p>{formError}</p> : null}
          </div>
          <div className={styles.buttonContainer}>
            <Button
              type="submit"
              disabled={isSubmitting}
              buttonType={ButtonType.PRIMARY}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </div>
          <p className={styles.redirectText}>
            Don't have an account?
            <span
              className={styles.redirect}
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
