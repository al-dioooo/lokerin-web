import type { Metadata } from "next";
import { Gerak } from "@/components/gerak/Gerak";

export const metadata: Metadata = { title: { default: "Lokerin", template: "%s · Lokerin" } };

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return <Gerak>{children}</Gerak>;
}
