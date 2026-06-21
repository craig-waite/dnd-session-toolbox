import { createServerFn } from '@tanstack/react-start'
import {
  findAllClasses,
  findClassByIndex,
  findFeaturesForClass,
  findLevelsForClass,
} from './classes.server'

export const listClasses = createServerFn({ method: 'GET' }).handler(() =>
  findAllClasses(),
)

export const getClass = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findClassByIndex(index))

export const getClassFeatures = createServerFn({ method: 'GET' })
  .validator((classIndex: string) => classIndex)
  .handler(({ data: classIndex }) => findFeaturesForClass(classIndex))

export const getClassLevels = createServerFn({ method: 'GET' })
  .validator((classIndex: string) => classIndex)
  .handler(({ data: classIndex }) => findLevelsForClass(classIndex))
