import { PasswordForm } from "./_components/password-form";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 bg-accent">
      <div className="w-full max-w-4xl">
        <PasswordForm />
      </div>
    </div>
  );
}
