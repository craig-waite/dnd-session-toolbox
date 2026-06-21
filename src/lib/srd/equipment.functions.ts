import { createServerFn } from '@tanstack/react-start'
import { findAllEquipment, findEquipmentByIndex } from './equipment.server'

export const listEquipment = createServerFn({ method: 'GET' }).handler(() =>
  findAllEquipment(),
)

export const getEquipmentItem = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findEquipmentByIndex(index))
