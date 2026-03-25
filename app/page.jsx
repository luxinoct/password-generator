import { GeneratePasswordForm } from "./_components/generate-password-form";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-accent">
      <div className="w-full max-w-4xl">
        <GeneratePasswordForm />
      </div>
    </div>
  );
}
