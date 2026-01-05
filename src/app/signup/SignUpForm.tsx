"use client";

import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignupMutation } from "@/api/userApi";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { pacifico } from "../fonts";
import { toast } from "react-toastify";
import cn from "classnames";
import Image from "next/image";
import styles from "../login/LogInForm.module.css";

import { SignupFields } from "./SignUpFields";
import { SignupActions } from "./SignUpAction";
import { GoogleSignupButton } from "./GoogleSignUpButton";

type SignupFormInputs = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export function SignUpForm() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signup] = useSignupMutation();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>();

  const password = watch("password");

  const onSubmit = useCallback(
    async (data: SignupFormInputs) => {
      try {
        // Create the user
        await signup(data).unwrap();

        // Automatically log them in
        const loginRes = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (loginRes?.error) {
          toast.error(t("signup_accountCreatedLoginFailed"));
        } else {
          // Send them to their original destination or home
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err: any) {
        // MongoDB duplicate key error code
        if (err?.data?.code === 11000) {
          toast.error(t("signup_emailAlreadyInUse"));
          return;
        }
        toast.error(t("signup_somethingWentWrong"));
      }
    },
    [signup, router, t, callbackUrl]
  );

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src="/reading2.jpg"
          alt="Illustration of people reading books"
          width={410}
          height={410}
          priority
        />
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <p className={cn(pacifico.className, styles.formTitle)}>
            {t("signup_signUpButton")}
          </p>
          <SignupFields
            register={register}
            errors={errors}
            password={password}
          />
          <SignupActions isSubmitting={isSubmitting} />
          <p className={styles.redirectText}>
            {t("signup_alreadyHaveAccount")}
            <button
              type="button"
              aria-label={t("signup_login")}
              className={styles.plainButton}
              onClick={() => router.push(`/login?callbackUrl=${callbackUrl}`)}
            >
              {t("signup_login")}
            </button>
          </p>
        </form>
        <div className={styles.googleLogIn}>
          <GoogleSignupButton isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
