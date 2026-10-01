import { AuthPhotoPanel } from "@/components/modules/auth/AuthPhotoPanel";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
      <div className="flex flex-col">
        <header className="flex items-center justify-between p-4 md:p-6">
          <Logo />
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>

      <AuthPhotoPanel />
    </div>
  );
}
