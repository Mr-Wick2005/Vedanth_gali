import { getMediaAdmin } from '@/lib/actions/media'
import { MediaLibraryManager } from '@/components/admin/MediaLibraryManager'

export const dynamic = 'force-dynamic'

export default async function AdminMediaPage() {
  const media = await getMediaAdmin()

  return <MediaLibraryManager initialMedia={media} />
}
