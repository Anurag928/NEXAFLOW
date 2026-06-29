import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — NexaFlow",
  description: "Sign in to your NexaFlow AI memory workspace.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
