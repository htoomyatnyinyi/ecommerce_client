import React from "react";
import Sidebar from "./Sidebar";
import { useAuthMeQuery } from "@/redux/query/authApi";
import { Loader2 } from "lucide-react";

const DashboardLayout: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { isLoading } = useAuthMeQuery();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-bold italic animate-pulse">
            Synchronizing your oasis...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar pt-28 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
