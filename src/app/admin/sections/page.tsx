import { getSectionsAdmin } from '@/lib/actions/sections'
import { SectionsManager } from '@/components/admin/SectionsManager'

export const dynamic = 'force-dynamic'

export default async function AdminSectionsPage() {
  const sections = await getSectionsAdmin()

  return <SectionsManager initialSections={sections} />
}
