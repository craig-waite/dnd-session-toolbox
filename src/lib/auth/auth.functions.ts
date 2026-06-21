import { createServerFn } from '@tanstack/react-start'
import { getUserId } from './auth.server'

export const getCurrentUserId = createServerFn({ method: 'GET' }).handler(() =>
  getUserId(),
)
