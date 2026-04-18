import Navbar from "@/components/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
        {children}
      </main>
    </>
  );
}
