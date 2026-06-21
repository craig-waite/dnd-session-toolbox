import { createServerFn } from '@tanstack/react-start'
import {
  findAllWeaponProperties,
  findWeaponPropertyByIndex,
} from './weapon-properties.server'

export const listWeaponProperties = createServerFn({ method: 'GET' }).handler(
  () => findAllWeaponProperties(),
)

export const getWeaponProperty = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findWeaponPropertyByIndex(index))
