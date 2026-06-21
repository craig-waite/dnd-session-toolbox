import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUserId } from '#/lib/auth/auth.functions'

export const Route = createFileRoute('/sign-in/$')({
  beforeLoad: async ({ params }) => {
    if (params._splat) return
    const userId = await getCurrentUserId()
    if (userId) throw redirect({ to: '/' })
  },
  component: SignInPage,
})

function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <SignIn routing="path" path="/sign-in" />
    </div>
  )
}
