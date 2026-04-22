"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: { name: string; email: string; avatar: string };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-indigo-50 data-[state=open]:text-indigo-700 rounded-lg transition"
            >
              {/* Avatar avec dégradé bleu → indigo */}
              <Avatar className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-700 shadow-md">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg text-indigo-500 font-bold">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>

              {/* Infos utilisateur */}
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-medium text-gray-900">
                  {user.name}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {user.email}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto text-gray-700" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Contenu du menu */}
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            className="min-w-[220px] rounded-lg shadow-lg border border-gray-200 bg-white"
          >
            <DropdownMenuLabel>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Avatar className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-700">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg text-indigo-500 font-bold">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-gray-900">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-gray-500">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-indigo-50 hover:text-indigo-700">
                <BadgeCheck className="mr-2 text-indigo-500" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-indigo-50 hover:text-indigo-700">
                <Bell className="mr-2 text-indigo-500" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="mr-2 text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
