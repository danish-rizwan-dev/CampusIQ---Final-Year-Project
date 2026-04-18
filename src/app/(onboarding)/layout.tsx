import Navbar from "@/components/Navbar";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        {children}
      </main>
    </>
  );
}
