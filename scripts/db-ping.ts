import 'dotenv/config'
import { getDb } from '../src/lib/db/mongo.server'

async function main() {
  const db = await getDb()
  const collections = await db.listCollections().toArray()
  const names = collections.map((collection) => collection.name).join(', ')
  console.log(`Connected to database "${db.databaseName}".`)
  console.log(`Collections: ${names || '(none yet)'}`)
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to connect to MongoDB:')
  console.error(error)
  process.exit(1)
})
