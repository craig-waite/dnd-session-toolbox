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

// Lazily create the client on first use and cache it on `globalThis` so it's
// reused across requests within the same isolate (and across Vite HMR reloads
// in dev). This must NOT run eagerly at module load: Cloudflare Workers
// disallow asynchronous I/O (like opening the MongoDB socket) outside of a
// request handler — doing it at module scope throws "Disallowed operation
// called within global scope" on every request in production.
export async function getDb(): Promise<Db> {
  const dbName = process.env.MONGODB_DB
  if (!dbName) {
    throw new Error('Missing MONGODB_DB environment variable')
  }
  globalThis._mongoClientPromise ??= createClientPromise()
  const client = await globalThis._mongoClientPromise
  return client.db(dbName)
}
