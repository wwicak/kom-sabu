import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Official } from '@/lib/models/content'

// GET - Public endpoint for fetching active officials
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const category = searchParams.get('category')
    const department = searchParams.get('department')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build filter query - only active officials
    const filter: any = { status: 'active' }
    
    if (level) filter.level = level
    if (category) filter.category = category
    if (department) filter.department = department
    if (featured) filter.featured = featured === 'true'

    const officials = await Official.find(filter)
      .select('-createdBy -updatedBy -__v') // Exclude sensitive fields
      .sort({ order: 1, level: 1, category: 1, name: 1 })
      .limit(limit)
      .lean()

    // Group officials by level and category for easier frontend consumption
    const groupedOfficials = officials.reduce((acc: any, official) => {
      const key = `${official.level}_${official.category}`
      if (!acc[key]) {
        acc[key] = {
          level: official.level,
          category: official.category,
          officials: []
        }
      }
      acc[key].officials.push(official)
      return acc
    }, {})

    // Get summary statistics
    const stats = {
      total: officials.length,
      byLevel: officials.reduce((acc: any, official) => {
        acc[official.level] = (acc[official.level] || 0) + 1
        return acc
      }, {}),
      byCategory: officials.reduce((acc: any, official) => {
        acc[official.category] = (acc[official.category] || 0) + 1
        return acc
      }, {}),
      byDepartment: officials.reduce((acc: any, official) => {
        acc[official.department] = (acc[official.department] || 0) + 1
        return acc
      }, {})
    }

    return NextResponse.json({
      success: true,
      data: officials,
      grouped: Object.values(groupedOfficials),
      statistics: stats,
      filters: {
        levels: await getUniqueValues('level'),
        categories: await getUniqueValues('category'),
        departments: await getUniqueValues('department')
      }
    })

  } catch (error) {
    console.error('Get officials error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch officials' },
      { status: 500 }
    )
  }
}

// Helper function to get unique filter values
async function getUniqueValues(field: string) {
  try {
    const values = await Official.distinct(field, { status: 'active' })
    return values.filter(Boolean) // Remove null/undefined values
  } catch (error) {
    console.error(`Failed to get unique values for ${field}:`, error)
    return []
  }
}
