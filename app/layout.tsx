import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Recall — AI Workspace",
  description: "A unified AI workspace combining Chat, Research, Code, Projects, Memory, and Extensions. Powered by advanced AI models.",
  keywords: "AI, chat, research, code, RAG, workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="app-layout">
            <Sidebar />
            <main className="main-area">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
