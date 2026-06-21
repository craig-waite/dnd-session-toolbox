import { type Db, MongoClient } from 'mongodb'

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }
  return new MongoClient(uri).connect()
}

// Reuse the client across Vite HMR reloads in dev so we don't leak connections.
let clientPromise: Promise<MongoClient>
if (process.env.NODE_ENV === 'production') {
  clientPromise = createClientPromise()
} else {
  globalThis._mongoClientPromise ??= createClientPromise()
  clientPromise = globalThis._mongoClientPromise
}

export async function getDb(): Promise<Db> {
  const dbName = process.env.MONGODB_DB
  if (!dbName) {
    throw new Error('Missing MONGODB_DB environment variable')
  }
  const client = await clientPromise
  return client.db(dbName)
}
