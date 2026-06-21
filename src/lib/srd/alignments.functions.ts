import { createServerFn } from '@tanstack/react-start'
import { findAllAlignments } from './alignments.server'

export const listAlignments = createServerFn({ method: 'GET' }).handler(() =>
  findAllAlignments(),
)
