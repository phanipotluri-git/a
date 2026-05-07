import Header from "@/components/layout/Header";
import TabNav from "@/components/layout/TabNav";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <TabNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
