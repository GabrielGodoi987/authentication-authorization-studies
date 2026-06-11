import type { LucideIcon } from "lucide-react";
import { LogOut, Package2, ShoppingCart, User } from "lucide-react";

export interface headerOptions {
  title: string;
  icon: LucideIcon;
  link: string;
}

export const headerItems: headerOptions[] = [
  {
    title: "Store",
    icon: Package2,
    link: "/",
  },
  {
    title: "Carrinho",
    icon: ShoppingCart,
    link: "/carrinho",
  },
  {
    title: "Conta",
    icon: User,
    link: "/conta",
  },
];

export const headerItemsAuthenticated: headerOptions[] = [
  ...headerItems,
  {
    title: "Sair",
    icon: LogOut,
    link: "/sair",
  },
];
