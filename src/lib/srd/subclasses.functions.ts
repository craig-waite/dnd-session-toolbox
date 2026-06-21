import { createServerFn } from '@tanstack/react-start'
import {
  findAllSubclasses,
  findFeaturesForSubclass,
  findSubclassByIndex,
} from './subclasses.server'

export const listSubclasses = createServerFn({ method: 'GET' }).handler(() =>
  findAllSubclasses(),
)

export const getSubclass = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findSubclassByIndex(index))

export const getSubclassFeatures = createServerFn({ method: 'GET' })
  .validator((subclassIndex: string) => subclassIndex)
  .handler(({ data: subclassIndex }) => findFeaturesForSubclass(subclassIndex))
