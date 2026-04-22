"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
                rounded-lg
                transition
                data-[state=open]:bg-indigo-100
                data-[state=open]:text-indigo-700
              "
            >
              {/* Logo / Avatar */}
              <div
                className="
                  bg-linear-to-br from-blue-600 to-indigo-700
                  text-white flex aspect-square size-8
                  items-center justify-center rounded-lg
                  shadow-md font-bold
                "
              >
                TV
              </div>

              {/* Infos entreprise */}
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-medium text-gray-900">
                  TechVision Group
                </span>
                <span className="truncate text-xs text-gray-500">
                  contact@techvision.com
                </span>
              </div>

              <ChevronsUpDown className="ml-auto text-gray-600" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Dropdown */}
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            className="
              min-w-[220px] rounded-xl
              shadow-lg border border-gray-200
              bg-white
            "
          >
            <DropdownMenuLabel>
              <div className="flex items-center gap-2 px-2 py-2">
                <div
                  className="
                    bg-linear-to-br from-blue-600 to-indigo-700
                    text-white flex aspect-square size-8
                    items-center justify-center rounded-lg
                    shadow-md font-bold
                  "
                >
                  TV
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-gray-900">
                    TechVision Group
                  </span>
                  <span className="truncate text-xs text-gray-500">
                    contact@techvision.com
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuItem
              className="
                hover:bg-indigo-50
                hover:text-indigo-700
                cursor-pointer
              "
            >
              Mon Compte
            </DropdownMenuItem>

            <DropdownMenuItem
              className="
                hover:bg-indigo-50
                hover:text-indigo-700
                cursor-pointer
              "
            >
              Paramètres
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
