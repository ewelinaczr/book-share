"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { validateEmail } from "../../../shared/validators/emailValidator";
import { validatePassword } from "../../../shared/validators/passwordValidator";
import { confirmPassword } from "../../../shared/validators/passwordConfirmValidator";
import { SlKey } from "react-icons/sl";
import { FaRegUser } from "react-icons/fa6";
import { pacifico } from "../fonts";
import { signIn } from "next-auth/react";
import styles from "../login/LogInForm.module.css";

import Input from "@/components/inputs/Input";
import Image from "next/image";
import Button, { ButtonType } from "@/components/buttons/Button";

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
      const loginRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (loginRes?.error) {
        setFormError("Account created, but login failed. Try manually.");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setFormError("Something went wrong. Please try again.");
    }
  };

  const password = watch("password");

  const renderGoogleLoginButton = () => {
    return (
      <Button
        type="submit"
        disabled={isSubmitting}
        buttonType={ButtonType.SECONDARY}
        onClick={() => signIn("google")}
      >
        <div className={styles.googleButton}>
          <img className={styles.googleIcon} src="/google.png"></img>
          Sign in with Google
        </div>
      </Button>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src={"/reading2.jpg"}
          alt={"reading graphic"}
          width={410}
          height={410}
        />
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className={`${pacifico.className} ${styles.formTitle}`}>
            Sign up with email
          </p>
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            icon={<FaRegUser />}
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            icon={<span>@</span>}
            placeholder="Enter your e-mail"
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
          <Input
            id="passwordConfirm"
            label="Confirm Password"
            type="password"
            placeholder="Enter your password"
            icon={<SlKey />}
            {...register("passwordConfirm", {
              required: "Please confirm your password",
              validate: (value) =>
                confirmPassword(password, value) || "Passwords do not match",
            })}
            error={errors.passwordConfirm?.message}
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
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </div>
          <p className={styles.redirectText}>
            Already have an account?
            <span
              className={styles.redirect}
              onClick={() => router.push("/login")}
            >
              Log In
            </span>
          </p>
        </form>
        <div className={styles.googleLogIn}> {renderGoogleLoginButton()}</div>
      </div>
    </div>
  );
}
