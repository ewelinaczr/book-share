import { SlKey } from "react-icons/sl";
import { validateEmail } from "../../../shared/validators/emailValidator";
import { validatePassword } from "../../../shared/validators/passwordValidator";
import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "@/components/inputs/Input";

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
};

export function LoginFields({ register, errors }: Props) {
  const t = useTranslations();

  return (
    <>
      <Input
        id="email"
        label={t("login_emailLabel")}
        type="email"
        placeholder={t("login_enterEmail")}
        icon={<span>@</span>}
        {...register("email", {
          required: t("login_emailRequired"),
          validate: (value) => validateEmail(value) || t("login_emailInvalid"),
        })}
        error={
          typeof errors.email?.message === "string"
            ? errors.email.message
            : undefined
        }
      />
      <Input
        id="password"
        type="password"
        label={t("login_passwordLabel")}
        placeholder={t("login_enterPassword")}
        icon={<SlKey />}
        {...register("password", {
          required: t("login_passwordRequired"),
          validate: (value) =>
            validatePassword(value) || t("login_passwordInvalid"),
        })}
        error={
          typeof errors.password?.message === "string"
            ? errors.password.message
            : undefined
        }
      />
    </>
  );
}
