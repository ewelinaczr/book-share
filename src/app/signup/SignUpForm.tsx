"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/api/userApi";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { pacifico } from "../fonts";
import cn from "classnames";
import Image from "next/image";
import styles from "../login/LogInForm.module.css";

import { SignupFields } from "./SignUpFields";
import { SignupError } from "./SignUpError";
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
  const [formError, setFormError] = useState("");
  const [signup] = useSignupMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>();

  const password = watch("password");

  const onSubmit = useCallback(
    async (data: SignupFormInputs) => {
      setFormError("");
      try {
        await signup(data).unwrap();
        const loginRes = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (loginRes?.error) {
          setFormError(t("signup_accountCreatedLoginFailed"));
        } else {
          router.push("/");
        }
      } catch (err) {
        setFormError(t("signup_somethingWentWrong"));
      }
    },
    [signup, router, t]
  );

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src="/reading2.jpg"
          alt="Illustration of people reading books"
          width={410}
          height={410}
        />
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className={cn(pacifico.className, styles.formTitle)}>
            {t("signup_signUpButton")} with email
          </p>
          <SignupFields
            register={register}
            errors={errors}
            password={password}
          />
          <SignupError message={formError} />
          <SignupActions isSubmitting={isSubmitting} />
          <p className={styles.redirectText}>
            {t("signup_alreadyHaveAccount")}
            <button
              type="button"
              aria-label={t("signup_login")}
              className={styles.plainButton}
              onClick={() => router.push("/login")}
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
