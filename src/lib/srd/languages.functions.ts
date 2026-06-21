import { createServerFn } from '@tanstack/react-start'
import { findAllLanguages } from './languages.server'

export const listLanguages = createServerFn({ method: 'GET' }).handler(() =>
  findAllLanguages(),
)
