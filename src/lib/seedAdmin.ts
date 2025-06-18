import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from './models'
import { Role } from './rbac'

// Admin user configuration
const ADMIN_USERS = [
  {
    username: 'superadmin',
    email: 'superadmin@sabu-raijua.go.id',
    fullName: 'Super Administrator',
    role: Role.SUPER_ADMIN,
    department: 'IT',
    position: 'System Administrator',
    password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!@#'
  },
  {
    username: 'admin',
    email: 'admin@sabu-raijua.go.id',
    fullName: 'Administrator',
    role: Role.ADMIN,
    department: 'Pemerintahan',
    position: 'Administrator Sistem',
    password: process.env.ADMIN_PASSWORD || 'Admin123!@#'
  },
  {
    username: 'editor',
    email: 'editor@sabu-raijua.go.id',
    fullName: 'Content Editor',
    role: Role.EDITOR,
    department: 'Humas',
    position: 'Editor Konten',
    password: process.env.EDITOR_PASSWORD || 'Editor123!@#'
  }
]

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  }
}

// Hash password
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Create or update admin user
async function createAdminUser(adminData: typeof ADMIN_USERS[0]) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: adminData.username },
        { email: adminData.email }
      ]
    })

    if (existingUser) {
      console.log(`User ${adminData.username} already exists. Updating...`)
      
      // Update existing user
      const hashedPassword = await hashPassword(adminData.password)
      
      await User.findByIdAndUpdate(existingUser._id, {
        fullName: adminData.fullName,
        role: adminData.role,
        department: adminData.department,
        position: adminData.position,
        password: hashedPassword,
        isActive: true,
        updatedAt: new Date()
      })
      
      console.log(`✅ Updated user: ${adminData.username} (${adminData.role})`)
      return existingUser
    } else {
      // Create new user
      const hashedPassword = await hashPassword(adminData.password)
      
      const newUser = new User({
        username: adminData.username,
        email: adminData.email,
        fullName: adminData.fullName,
        role: adminData.role,
        department: adminData.department,
        position: adminData.position,
        password: hashedPassword,
        isActive: true,
        emailVerified: true, // Admin users are pre-verified
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      await newUser.save()
      console.log(`✅ Created user: ${adminData.username} (${adminData.role})`)
      return newUser
    }
  } catch (error) {
    console.error(`❌ Error creating/updating user ${adminData.username}:`, error)
    throw error
  }
}

// Main seeding function
export async function seedAdminUsers() {
  try {
    console.log('🌱 Starting admin user seeding...')
    
    await connectToDatabase()
    console.log('📦 Connected to MongoDB')
    
    // Create/update all admin users
    for (const adminData of ADMIN_USERS) {
      await createAdminUser(adminData)
    }
    
    console.log('✅ Admin user seeding completed successfully!')
    
    // Display login information
    console.log('\n📋 Admin Login Information:')
    console.log('=' .repeat(50))
    
    for (const admin of ADMIN_USERS) {
      console.log(`${admin.role.toUpperCase()}:`)
      console.log(`  Username: ${admin.username}`)
      console.log(`  Email: ${admin.email}`)
      console.log(`  Password: ${admin.password}`)
      console.log(`  Role: ${admin.role}`)
      console.log('')
    }
    
    console.log('⚠️  IMPORTANT: Change default passwords after first login!')
    console.log('=' .repeat(50))
    
  } catch (error) {
    console.error('❌ Admin user seeding failed:', error)
    throw error
  }
}

// Standalone script execution
if (require.main === module) {
  seedAdminUsers()
    .then(() => {
      console.log('🎉 Seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

// Function to create a single admin user (for API use)
export async function createSingleAdminUser(userData: {
  username: string
  email: string
  fullName: string
  role: Role
  department?: string
  position?: string
  password: string
}) {
  try {
    await connectToDatabase()
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: userData.username },
        { email: userData.email }
      ]
    })

    if (existingUser) {
      throw new Error('User with this username or email already exists')
    }

    // Create new user
    const hashedPassword = await hashPassword(userData.password)
    
    const newUser = new User({
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      department: userData.department,
      position: userData.position,
      password: hashedPassword,
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    await newUser.save()
    
    return {
      id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      department: newUser.department,
      position: newUser.position,
      isActive: newUser.isActive
    }
  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

// Function to reset admin passwords (for emergency use)
export async function resetAdminPasswords() {
  try {
    console.log('🔄 Resetting admin passwords...')
    
    await connectToDatabase()
    
    for (const adminData of ADMIN_USERS) {
      const hashedPassword = await hashPassword(adminData.password)
      
      await User.findOneAndUpdate(
        { username: adminData.username },
        { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      )
      
      console.log(`✅ Reset password for: ${adminData.username}`)
    }
    
    console.log('✅ All admin passwords reset successfully!')
    
  } catch (error) {
    console.error('❌ Password reset failed:', error)
    throw error
  }
}

// Function to deactivate all admin users (for security)
export async function deactivateAdminUsers() {
  try {
    console.log('🔒 Deactivating admin users...')
    
    await connectToDatabase()
    
    await User.updateMany(
      { role: { $in: [Role.SUPER_ADMIN, Role.ADMIN] } },
      { 
        isActive: false,
        updatedAt: new Date()
      }
    )
    
    console.log('✅ All admin users deactivated!')
    
  } catch (error) {
    console.error('❌ Deactivation failed:', error)
    throw error
  }
}

// Function to list all admin users
export async function listAdminUsers() {
  try {
    await connectToDatabase()
    
    const adminUsers = await User.find({
      role: { $in: [Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR] }
    }).select('-password').lean()
    
    console.log('👥 Admin Users:')
    console.log('=' .repeat(50))
    
    for (const user of adminUsers) {
      console.log(`${user.fullName} (${user.username})`)
      console.log(`  Email: ${user.email}`)
      console.log(`  Role: ${user.role}`)
      console.log(`  Department: ${user.department || 'N/A'}`)
      console.log(`  Active: ${user.isActive ? '✅' : '❌'}`)
      console.log(`  Last Login: ${user.lastLogin || 'Never'}`)
      console.log('')
    }
    
    return adminUsers
    
  } catch (error) {
    console.error('❌ Failed to list admin users:', error)
    throw error
  }
}
