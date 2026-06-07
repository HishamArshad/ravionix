
import Navbar from "@/components/landing/Navbar";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) { 

  return (
    <div>
        <Navbar />
        {children}
    </div>
  );
}