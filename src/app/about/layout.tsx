import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6">{children}</main>
      <Footer />
    </>
  );
}
