import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav variant="marketing" />
      <main>{children}</main>
      <Footer />
    </>
  );
}
