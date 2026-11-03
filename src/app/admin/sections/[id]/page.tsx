import { notFound } from 'next/navigation'
import { getSectionById, getSectionVersions } from '@/lib/actions/sections'
import { getMediaAdmin } from '@/lib/actions/media'
import { SectionEditor } from '@/components/admin/SectionEditor'

interface SectionEditPageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function SectionEditPage({ params }: SectionEditPageProps) {
  const { id } = await params
  const [section, versions, media] = await Promise.all([
    getSectionById(id),
    getSectionVersions(id),
    getMediaAdmin(),
  ])

  if (!section) {
    notFound()
  }

  return (
    <SectionEditor
      section={section}
      versions={versions}
      availableMedia={media}
    />
  )
}
