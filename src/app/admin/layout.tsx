import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Painel Luciano Góis" },
  robots: { index: false, follow: false },
};

/** Camada mínima: o login fica fora do grupo (painel) e não herda a sidebar. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <>{children}</>;
}
