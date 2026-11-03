import { getNavItemsAdmin } from '@/lib/actions/navigation'
import { NavbarManager } from '@/components/admin/NavbarManager'

export const dynamic = 'force-dynamic'

export default async function AdminNavigationPage() {
  const items = await getNavItemsAdmin()

  return <NavbarManager initialItems={items} />
}
