import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import UserAccountSidebar from "@/components/sidebar/user/Sidebar";

type PropsType = {
  children: React.ReactNode;
};

const UserAccountLayout: React.FC<PropsType> = ({ children }) => {
  return (
    <SidebarProvider className="mt-1 border-1 border-blue-300">
      <UserAccountSidebar />
      <main>
        <SidebarTrigger />
        <SidebarInset>{children}</SidebarInset>
      </main>
    </SidebarProvider>
  );
};

export default UserAccountLayout;
