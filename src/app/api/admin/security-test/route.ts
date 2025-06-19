import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth-middleware'
import { Permission } from '@/lib/rbac'
import { SecurityTests, SecurityMonitoring } from '@/lib/security-tests'

export const GET = requirePermission(Permission.MANAGE_SETTINGS)(async function(request: NextRequest) {
  try {
    // Run security configuration check
    const configCheck = SecurityMonitoring.checkSecurityConfiguration()
    
    // Run all security tests
    const testResults = await SecurityTests.runAllTests()
    
    // Generate security report
    const securityReport = {
      timestamp: new Date().toISOString(),
      overallStatus: testResults.overallPassed && configCheck.issues.length === 0 ? 'PASS' : 'FAIL',
      configuration: {
        issues: configCheck.issues,
        recommendations: configCheck.recommendations
      },
      tests: testResults.results,
      summary: {
        totalTests: testResults.results.length,
        passedTests: testResults.results.filter(r => r.passed).length,
        failedTests: testResults.results.filter(r => !r.passed).length,
        configurationIssues: configCheck.issues.length
      }
    }

    return NextResponse.json({
      success: true,
      data: securityReport
    })

  } catch (error) {
    console.error('Security test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run security tests',
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
})
