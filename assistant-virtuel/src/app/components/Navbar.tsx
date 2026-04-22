"use client";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { LinkItem } from "@/types/LinkItem";

type NavbarProps = {
  readonly links: readonly { readonly name: string; readonly href: string }[];
};

export default function Navbar({
  links,
  children,
}: NavbarProps & { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar links={links as LinkItem[]} />

      <SidebarInset>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
