
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  return (
    <div className="min-h-screen flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="container py-6 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
