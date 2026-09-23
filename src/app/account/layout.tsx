import { AccountNav } from "@/components/account/AccountNav";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 md:px-8 lg:flex-row">
      <AccountNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
