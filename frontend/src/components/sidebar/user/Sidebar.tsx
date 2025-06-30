import SidebarMenu from "./Menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";

const UserAccountSidebar: React.FC = () => {
  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="border-1 border-red-500"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>User Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu />
          </SidebarGroupContent>
          <SidebarRail />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default UserAccountSidebar;
