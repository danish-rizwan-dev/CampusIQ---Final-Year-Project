import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <SignUp 
        routing="path" 
        path="/signup"
        signInUrl="/login"
        forceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            card: "glass-card",
            headerTitle: "gradient-text",
            formButtonPrimary: "btn-primary",
            footerActionLink: "text-accent",
          }
        }}
      />
    </div>
  );
}
