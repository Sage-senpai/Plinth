import { Nav } from '@/components/Nav';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav variant="workspace" />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </>
  );
}
