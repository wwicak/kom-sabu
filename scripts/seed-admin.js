#!/usr/bin/env node

/**
 * Admin User Seeding Script for Sabu Raijua Government Website
 * 
 * This script creates initial admin users for the system.
 * Run with: npm run seed:admin
 */

require('dotenv').config({ path: '.env.local' })

// We need to use ts-node to run TypeScript files
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs'
  }
})

// Import the seeding function
const { seedAdminUsers, listAdminUsers, resetAdminPasswords } = require('../src/lib/seedAdmin.ts')

// Parse command line arguments
const args = process.argv.slice(2)
const command = args[0] || 'seed'

async function main() {
  try {
    console.log('🚀 Sabu Raijua Admin User Management')
    console.log('=' .repeat(50))
    
    switch (command) {
      case 'seed':
        console.log('📝 Creating/updating admin users...')
        await seedAdminUsers()
        break
        
      case 'list':
        console.log('📋 Listing admin users...')
        await listAdminUsers()
        break
        
      case 'reset':
        console.log('🔄 Resetting admin passwords...')
        await resetAdminPasswords()
        break
        
      default:
        console.log('❌ Unknown command:', command)
        console.log('')
        console.log('Available commands:')
        console.log('  seed  - Create/update admin users (default)')
        console.log('  list  - List all admin users')
        console.log('  reset - Reset admin passwords to defaults')
        console.log('')
        console.log('Usage: npm run seed:admin [command]')
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
