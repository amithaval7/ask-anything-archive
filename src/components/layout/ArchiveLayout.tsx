
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface ArchiveLayoutProps {
  children: ReactNode;
}

export const ArchiveLayout = ({ children }: ArchiveLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-secondary/30">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};
