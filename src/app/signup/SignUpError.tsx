import styles from "../login/LogInForm.module.css";

export function SignupError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className={styles.error}>
      <p role="alert" id="formError">
        {message}
      </p>
    </div>
  );
}
