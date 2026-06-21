import { auth } from '@clerk/tanstack-react-start/server'

export async function getUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}
