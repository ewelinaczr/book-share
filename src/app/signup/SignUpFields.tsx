import { SlKey } from "react-icons/sl";
import { FaRegUser } from "react-icons/fa6";
import Input from "@/components/inputs/Input";
import { validateEmail } from "../../../shared/validators/emailValidator";
import { validatePassword } from "../../../shared/validators/passwordValidator";
import { confirmPassword } from "../../../shared/validators/passwordConfirmValidator";
import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  password: string;
};

export function SignupFields({ register, errors, password }: Props) {
  const t = useTranslations();

  return (
    <>
      <Input
        id="name"
        label={t("signup_fullName")}
        type="text"
        placeholder={t("signup_enterYourName")}
        icon={<FaRegUser />}
        {...register("name", { required: t("signup_nameRequired") })}
        error={
          typeof errors.name?.message === "string"
            ? errors.name.message
            : undefined
        }
      />
      <Input
        id="email"
        label={t("signup_email")}
        type="email"
        icon={<span>@</span>}
        placeholder={t("signup_enterYourEmail")}
        {...register("email", {
          required: t("signup_emailRequired"),
          validate: (value) => validateEmail(value) || t("signup_invalidEmail"),
        })}
        error={
          typeof errors.email?.message === "string"
            ? errors.email.message
            : undefined
        }
      />
      <Input
        id="password"
        label={t("signup_password")}
        type="password"
        placeholder={t("signup_enterYourPassword")}
        icon={<SlKey />}
        {...register("password", {
          required: t("signup_passwordRequired"),
          validate: (value) =>
            validatePassword(value) || t("signup_passwordMin"),
        })}
        error={
          typeof errors.password?.message === "string"
            ? errors.password.message
            : undefined
        }
      />
      <Input
        id="passwordConfirm"
        label={t("signup_confirmPassword")}
        type="password"
        placeholder={t("signup_enterYourPassword")}
        icon={<SlKey />}
        {...register("passwordConfirm", {
          required: t("signup_pleaseConfirmPassword"),
          validate: (value) =>
            confirmPassword(password, value) || t("signup_passwordsDoNotMatch"),
        })}
        error={
          typeof errors.passwordConfirm?.message === "string"
            ? errors.passwordConfirm.message
            : undefined
        }
      />
    </>
  );
}
