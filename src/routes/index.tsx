import { createFileRoute, redirect } from '@tanstack/react-router'
import { DmShell } from '#/components/dm-shell/DmShell'
import { getCurrentUserId } from '#/lib/auth/auth.functions'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const userId = await getCurrentUserId()
    if (!userId) {
      throw redirect({ to: '/sign-in/$', params: { _splat: '' } })
    }
  },
  component: Home,
})

function Home() {
  return <DmShell />
}
