import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <SignIn 
        routing="path" 
        path="/login"
        signUpUrl="/signup" 
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
