import { createServerFn } from '@tanstack/react-start'
import {
  findAllMagicSchools,
  findMagicSchoolByIndex,
} from './magic-schools.server'

export const listMagicSchools = createServerFn({ method: 'GET' }).handler(() =>
  findAllMagicSchools(),
)

export const getMagicSchool = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findMagicSchoolByIndex(index))
