import { GeneratePasswordForm } from "@/components/generate-password-form";

export default function HomePage() {
  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <GeneratePasswordForm />
      </div>
    </div>
  );
}
