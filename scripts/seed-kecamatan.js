#!/usr/bin/env node

/**
 * Accurate Kecamatan Data Seeding Script for Sabu Raijua Government Website
 * 
 * This script creates/updates accurate kecamatan data based on official sources.
 * Run with: npm run seed:kecamatan
 */

require('dotenv').config({ path: '.env.local' })

// We need to use ts-node to run TypeScript files
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs'
  }
})

// Import the seeding function
const { seedAccurateKecamatanData, updateKecamatanData } = require('../src/lib/seedKecamatanAccurate.ts')

// Parse command line arguments
const args = process.argv.slice(2)
const command = args[0] || 'seed'

async function main() {
  try {
    console.log('🚀 Sabu Raijua Kecamatan Data Management')
    console.log('=' .repeat(50))
    
    switch (command) {
      case 'seed':
        console.log('📝 Creating accurate kecamatan data...')
        await seedAccurateKecamatanData()
        break
        
      case 'update':
        console.log('🔄 Updating kecamatan data...')
        await updateKecamatanData()
        break
        
      default:
        console.log('❌ Unknown command:', command)
        console.log('')
        console.log('Available commands:')
        console.log('  seed   - Create/replace all kecamatan data (default)')
        console.log('  update - Update existing kecamatan data')
        console.log('')
        console.log('Usage: npm run seed:kecamatan [command]')
        process.exit(1)
    }
    
  } catch (error) {
    console.error('💥 Script failed:', error.message)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

// Run the script
main()
