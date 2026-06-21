import { createServerFn } from '@tanstack/react-start'
import { findAllDamageTypes } from './damage-types.server'

export const listDamageTypes = createServerFn({ method: 'GET' }).handler(() =>
  findAllDamageTypes(),
)
