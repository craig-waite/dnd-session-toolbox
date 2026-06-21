import { createServerFn } from '@tanstack/react-start'
import {
  findAllEquipmentCategories,
  findEquipmentCategoryByIndex,
} from './equipment-categories.server'

export const listEquipmentCategories = createServerFn({
  method: 'GET',
}).handler(() => findAllEquipmentCategories())

export const getEquipmentCategory = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findEquipmentCategoryByIndex(index))
