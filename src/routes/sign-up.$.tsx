import { SignUp } from '@clerk/tanstack-react-start'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUserId } from '#/lib/auth/auth.functions'

export const Route = createFileRoute('/sign-up/$')({
  beforeLoad: async ({ params }) => {
    if (params._splat) return
    const userId = await getCurrentUserId()
    if (userId) throw redirect({ to: '/' })
  },
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <SignUp routing="path" path="/sign-up" />
    </div>
  )
}
