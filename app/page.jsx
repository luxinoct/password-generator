import { PasswordForm } from "./_components/password-form";

export default function HomePage() {
  return (
    <div className="min-h-screen md:flex md:items-center md:justify-center p-4 bg-accent">
      <div className="w-full max-w-4xl">
        <PasswordForm />
      </div>
    </div>
  );
}
