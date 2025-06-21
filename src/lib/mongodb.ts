import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000, // Increased timeout for Atlas
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000, // Added connection timeout
  // Security options for MongoDB Atlas
  tls: true, // Always use TLS for Atlas
  retryWrites: true,
  // Connection monitoring
  heartbeatFrequencyMS: 10000,
  maxIdleTimeMS: 30000,
  // Additional Atlas-specific options
  authSource: 'admin',
  ssl: true,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Force fresh connection in development to avoid DNS caching issues
if (process.env.NODE_ENV === 'development') {
  console.log('Creating fresh MongoDB connection with URI:', uri?.substring(0, 50) + '...')
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
} else {
  // In production mode, use global caching
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
}

// Database connection helper
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise
    const db = client.db('test') // Using test database where our data is located
    return { client, db }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw new Error('Database connection failed')
  }
}

// Health check for database connection
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { client } = await connectToDatabase()
    await client.db('admin').command({ ping: 1 })
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Graceful shutdown
export async function closeDatabaseConnection(): Promise<void> {
  try {
    const client = await clientPromise
    await client.close()
  } catch (error) {
    console.error('Error closing database connection:', error)
  }
}

export default clientPromise
