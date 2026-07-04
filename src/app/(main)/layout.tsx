import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { getSidebarTree } from "@/lib/posts";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = getSidebarTree();

  return (
    <>
      <Header />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <Sidebar items={sidebarItems} />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
      <Footer />
    </>
  );
}
