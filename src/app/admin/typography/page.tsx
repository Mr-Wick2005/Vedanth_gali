import { getFontsAdmin } from '@/lib/actions/fonts'
import { getSiteSettings } from '@/lib/content'
import { TypographyManager } from '@/components/admin/TypographyManager'

export const dynamic = 'force-dynamic'

export default async function AdminTypographyPage() {
  const [fonts, settings] = await Promise.all([
    getFontsAdmin(),
    getSiteSettings(),
  ])

  return <TypographyManager initialFonts={fonts} settings={settings} />
}
