import mongoose from 'mongoose'

const BreadcrumbAnalyticsSchema = new mongoose.Schema({
  // Event details
  action: {
    type: String,
    required: true,
    enum: ['breadcrumb_click', 'breadcrumb_view'],
    index: true
  },
  category: {
    type: String,
    required: true,
    default: 'navigation'
  },
  label: {
    type: String,
    required: true,
    index: true
  },
  value: {
    type: Number,
    default: null
  },

  // Custom parameters
  custom_parameters: {
    source_page: String,
    target_page: String,
    breadcrumb_position: Number,
    breadcrumb_depth: Number,
    page_url: String,
    breadcrumb_items: [String],
    user_session_id: String
  },

  // Technical details
  clientIP: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  referrer: String,
  screen_resolution: String,
  viewport_size: String,

  // Session tracking
  sessionId: {
    type: String,
    index: true
  },

  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  collection: 'breadcrumb_analytics'
})

// Indexes for better query performance
BreadcrumbAnalyticsSchema.index({ action: 1, timestamp: -1 })
BreadcrumbAnalyticsSchema.index({ label: 1, action: 1 })
BreadcrumbAnalyticsSchema.index({ sessionId: 1, timestamp: 1 })
BreadcrumbAnalyticsSchema.index({ 'custom_parameters.source_page': 1 })
BreadcrumbAnalyticsSchema.index({ 'custom_parameters.target_page': 1 })

// TTL index to automatically delete old analytics data (optional - keep 1 year)
BreadcrumbAnalyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 })

// Virtual for formatted timestamp
BreadcrumbAnalyticsSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toISOString()
})

// Static methods for common queries
BreadcrumbAnalyticsSchema.statics.getPopularPaths = async function(startDate?: Date, endDate?: Date) {
  const match: any = { action: 'breadcrumb_view' }
  if (startDate || endDate) {
    match.timestamp = {}
    if (startDate) match.timestamp.$gte = startDate
    if (endDate) match.timestamp.$lte = endDate
  }

  return this.aggregate([
    { $match: match },
    { $group: { _id: '$label', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { path: '$_id', views: '$count', _id: 0 } }
  ])
}

BreadcrumbAnalyticsSchema.statics.getClickThroughRate = async function(startDate?: Date, endDate?: Date) {
  const match: any = {}
  if (startDate || endDate) {
    match.timestamp = {}
    if (startDate) match.timestamp.$gte = startDate
    if (endDate) match.timestamp.$lte = endDate
  }

  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalViews: {
          $sum: { $cond: [{ $eq: ['$action', 'breadcrumb_view'] }, 1, 0] }
        },
        totalClicks: {
          $sum: { $cond: [{ $eq: ['$action', 'breadcrumb_click'] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        totalViews: 1,
        totalClicks: 1,
        clickThroughRate: {
          $cond: [
            { $gt: ['$totalViews', 0] },
            { $multiply: [{ $divide: ['$totalClicks', '$totalViews'] }, 100] },
            0
          ]
        }
      }
    }
  ])

  return result[0] || { totalViews: 0, totalClicks: 0, clickThroughRate: 0 }
}

BreadcrumbAnalyticsSchema.statics.getDropOffAnalysis = async function(startDate?: Date, endDate?: Date) {
  const match: any = {}
  if (startDate || endDate) {
    match.timestamp = {}
    if (startDate) match.timestamp.$gte = startDate
    if (endDate) match.timestamp.$lte = endDate
  }

  // Get position-wise click data
  const positionData = await this.aggregate([
    { $match: { ...match, action: 'breadcrumb_click' } },
    { $match: { 'custom_parameters.breadcrumb_position': { $exists: true } } },
    {
      $group: {
        _id: '$custom_parameters.breadcrumb_position',
        clicks: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  // Get depth-wise view data
  const depthData = await this.aggregate([
    { $match: { ...match, action: 'breadcrumb_view' } },
    { $match: { 'custom_parameters.breadcrumb_depth': { $exists: true } } },
    {
      $group: {
        _id: '$custom_parameters.breadcrumb_depth',
        views: { $sum: 1 }
      }
    }
  ])

  return { positionData, depthData }
}

// Instance methods
BreadcrumbAnalyticsSchema.methods.isClick = function() {
  return this.action === 'breadcrumb_click'
}

BreadcrumbAnalyticsSchema.methods.isView = function() {
  return this.action === 'breadcrumb_view'
}

BreadcrumbAnalyticsSchema.methods.getSessionEvents = async function() {
  if (!this.sessionId) return []
  
  return this.constructor.find({ 
    sessionId: this.sessionId 
  }).sort({ timestamp: 1 })
}

export const BreadcrumbAnalytics = mongoose.models.BreadcrumbAnalytics || 
  mongoose.model('BreadcrumbAnalytics', BreadcrumbAnalyticsSchema)

export default BreadcrumbAnalytics
