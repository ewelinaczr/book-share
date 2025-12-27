"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { pacifico } from "../fonts";
import { toast } from "react-toastify";
import cn from "classnames";
import styles from "./LogInForm.module.css";
import Image from "next/image";

import { LoginFields } from "./LogInFields";
import { LoginActions } from "./LogInAction";
import { GoogleLoginButton } from "./GoogleLoginButton";

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LogInForm() {
  const t = useTranslations();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = useCallback(
    async (data: LoginFormInputs) => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(t("login_invalidCredentials"));
      } else {
        router.push("/");
      }
    },
    [router]
  );

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src="/reading1.jpg"
          alt="Illustration of people reading books"
          width={410}
          height={410}
        />
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <p className={cn(pacifico.className, styles.formTitle)}>
            {t("login_title")}
          </p>
          <LoginFields register={register} errors={errors} />
          <LoginActions isSubmitting={isSubmitting} />
          <p className={styles.redirectText}>
            {t("login_dontHaveAccount")}
            <button
              type="button"
              aria-label={t("buttons_signUp")}
              className={styles.plainButton}
              onClick={() => router.push("/signup")}
            >
              {t("login_signUp")}
            </button>
          </p>
        </form>
        <div className={styles.googleLogIn}>
          <GoogleLoginButton isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
