import { createServerFn } from '@tanstack/react-start'
import { findAllFeatures, findFeatureByIndex } from './features.server'

export const listFeatures = createServerFn({ method: 'GET' }).handler(() =>
  findAllFeatures(),
)

export const getFeature = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findFeatureByIndex(index))
