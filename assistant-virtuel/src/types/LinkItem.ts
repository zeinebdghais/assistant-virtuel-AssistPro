// types/LinkItem.ts
import { ComponentType } from "react";

export type LinkItem = {
  name: string;
  href: string;
  icon?: ComponentType<any>;
};
