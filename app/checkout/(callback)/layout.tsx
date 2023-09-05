import { HomeButton } from '@/components/HomeButton'
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen p-24">
      <HomeButton />
      {children}
    </main>
  )
}
