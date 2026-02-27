import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1C2D3A] flex flex-col items-center justify-center px-4">
      <div className="mb-12">
        <Image
          src="/logos/etercom-full.png"
          alt="Eter Comunicações"
          width={180}
          height={60}
          className="mx-auto brightness-0 invert"
          priority
        />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
