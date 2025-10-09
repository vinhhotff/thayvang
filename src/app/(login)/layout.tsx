import { AuthProvider } from "@/Context/AuthContext";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <><AuthProvider>
    {children}</AuthProvider></>;
}