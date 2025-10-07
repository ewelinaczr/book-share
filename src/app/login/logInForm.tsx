"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { validateEmail } from "../../../shared/validators/emailValidator";
import { validatePassword } from "../../../shared/validators/passwordValidator";
import { SlKey } from "react-icons/sl";
import { pacifico } from "../fonts";
import { signIn } from "next-auth/react";
import styles from "./LogInForm.module.css";

import Input from "@/components/inputs/Input";
import Button, { ButtonType } from "@/components/buttons/Button";
import Image from "next/image";
import ButtonPlain from "@/components/buttons/ButtonPlain";

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

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setFormError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  const renderGoogleLoginButton = () => {
    return (
      <Button
        type="submit"
        ariaLabel="Sign in with Google"
        disabled={isSubmitting}
        buttonType={ButtonType.SECONDARY}
        onClick={() => {
          signIn("google", {
            callbackUrl: "/",
            prompt: "select_account",
          });
        }}
      >
        <div className={styles.googleButton}>
          <img
            className={styles.googleIcon}
            src="/google.png"
            alt="Google logo"
          />
          Sign in with Google
        </div>
      </Button>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src={"/reading1.jpg"}
          alt={"Illustration of people reading books"}
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
              ariaLabel="Sign in"
              disabled={isSubmitting}
              buttonType={ButtonType.PRIMARY}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </div>
          <p className={styles.redirectText}>
            Don't have an account?
            <ButtonPlain
              text="Sign Up"
              ariaLabel="Sign up"
              onClick={() => router.push("/signup")}
            />
          </p>
        </form>
        <div className={styles.googleLogIn}>{renderGoogleLoginButton()}</div>
      </div>
    </div>
  );
}
