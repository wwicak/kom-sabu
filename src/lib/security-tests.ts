import { NextRequest } from 'next/server'
import { DataProtection, PIIDetector, DataClassification, PIIType } from './data-protection'
import { validatePassword, validateFileUpload } from './validations'
import { EnhancedRateLimit } from './enhanced-rate-limit'
import { verifyToken } from './auth-middleware'

// Security test suite
export class SecurityTests {
  
  // Test 1: Password Security
  static testPasswordSecurity(): { passed: boolean; details: string[] } {
    const details: string[] = []
    let passed = true

    // Test weak passwords
    const weakPasswords = [
      'password',
      '123456',
      'admin',
      'qwerty',
      'Password1',
      'short'
    ]

    for (const password of weakPasswords) {
      const result = validatePassword(password)
      if (result.isValid) {
        passed = false
        details.push(`❌ Weak password "${password}" was accepted`)
      } else {
        details.push(`✅ Weak password "${password}" was correctly rejected`)
      }
    }

    // Test strong password
    const strongPassword = 'MyStr0ng!P@ssw0rd2024#'
    const strongResult = validatePassword(strongPassword)
    if (strongResult.isValid) {
      details.push('✅ Strong password was correctly accepted')
    } else {
      passed = false
      details.push('❌ Strong password was incorrectly rejected')
    }

    return { passed, details }
  }

  // Test 2: Data Encryption
  static testDataEncryption(): { passed: boolean; details: string[] } {
    const details: string[] = []
    let passed = true

    try {
      const sensitiveData = 'user@example.com'
      
      // Test encryption
      const encrypted = DataProtection.encryptSensitiveData(
        sensitiveData, 
        DataClassification.CONFIDENTIAL, 
        PIIType.EMAIL
      )
      
      if (encrypted === sensitiveData) {
        passed = false
        details.push('❌ Data was not encrypted')
      } else {
        details.push('✅ Data was successfully encrypted')
      }

      // Test decryption
      const { data: decrypted, metadata } = DataProtection.decryptSensitiveData(encrypted)
      
      if (decrypted === sensitiveData) {
        details.push('✅ Data was successfully decrypted')
      } else {
        passed = false
        details.push('❌ Data decryption failed')
      }

      // Test metadata
      if (metadata.classification === DataClassification.CONFIDENTIAL) {
        details.push('✅ Metadata was correctly preserved')
      } else {
        passed = false
        details.push('❌ Metadata was not preserved correctly')
      }

    } catch (error) {
      passed = false
      details.push(`❌ Encryption test failed: ${error}`)
    }

    return { passed, details }
  }

  // Test 3: PII Detection
  static testPIIDetection(): { passed: boolean; details: string[] } {
    const details: string[] = []
    let passed = true

    const testText = 'Contact John Doe at john.doe@example.com or call +1-555-123-4567'
    const detectedPII = PIIDetector.detectPII(testText)

    // Check if email was detected
    const emailDetected = detectedPII.some(pii => pii.type === PIIType.EMAIL)
    if (emailDetected) {
      details.push('✅ Email PII was correctly detected')
    } else {
      passed = false
      details.push('❌ Email PII was not detected')
    }

    // Check if phone was detected
    const phoneDetected = detectedPII.some(pii => pii.type === PIIType.PHONE)
    if (phoneDetected) {
      details.push('✅ Phone PII was correctly detected')
    } else {
      passed = false
      details.push('❌ Phone PII was not detected')
    }

    // Test PII sanitization
    const sanitized = PIIDetector.sanitizePII(testText)
    if (sanitized !== testText && !sanitized.includes('john.doe@example.com')) {
      details.push('✅ PII was correctly sanitized')
    } else {
      passed = false
      details.push('❌ PII sanitization failed')
    }

    return { passed, details }
  }

  // Test 4: Rate Limiting
  static testRateLimiting(): { passed: boolean; details: string[] } {
    const details: string[] = []
    let passed = true

    try {
      const rateLimiter = new EnhancedRateLimit({
        windowMs: 60000, // 1 minute
        maxRequests: 3
      })

      // Create mock request
      const mockRequest = {
        headers: {
          get: (name: string) => {
            if (name === 'x-forwarded-for') return '192.168.1.1'
            return null
          }
        }
      } as NextRequest

      // Test normal requests
      for (let i = 1; i <= 3; i++) {
        const result = rateLimiter.check(mockRequest)
        if (result.allowed) {
          details.push(`✅ Request ${i}/3 was allowed`)
        } else {
          passed = false
          details.push(`❌ Request ${i}/3 was incorrectly blocked`)
        }
      }

      // Test rate limit exceeded
      const blockedResult = rateLimiter.check(mockRequest)
      if (!blockedResult.allowed) {
        details.push('✅ Rate limit correctly blocked excess requests')
      } else {
        passed = false
        details.push('❌ Rate limit failed to block excess requests')
      }

    } catch (error) {
      passed = false
      details.push(`❌ Rate limiting test failed: ${error}`)
    }

    return { passed, details }
  }

  // Test 5: File Upload Security
  static testFileUploadSecurity(): { passed: boolean; details: string[] } {
    const details: string[] = []
    let passed = true

    // Test malicious file types
    const maliciousFiles = [
      { name: 'script.php', type: 'application/x-php', size: 1000 },
      { name: 'malware.exe', type: 'application/x-executable', size: 1000 },
      { name: 'script.js', type: 'application/javascript', size: 1000 }
    ]

    for (const fileData of maliciousFiles) {
      const mockFile = {
        name: fileData.name,
        type: fileData.type,
        size: fileData.size
      } as File

      const result = validateFileUpload(mockFile)
      if (!result.isValid) {
        details.push(`✅ Malicious file "${fileData.name}" was correctly rejected`)
      } else {
        passed = false
        details.push(`❌ Malicious file "${fileData.name}" was incorrectly accepted`)
      }
    }

    // Test legitimate file
    const legitimateFile = {
      name: 'image.jpg',
      type: 'image/jpeg',
      size: 1000000 // 1MB
    } as File

    const legitimateResult = validateFileUpload(legitimateFile)
    if (legitimateResult.isValid) {
      details.push('✅ Legitimate file was correctly accepted')
    } else {
      passed = false
      details.push('❌ Legitimate file was incorrectly rejected')
    }

    // Test oversized file
    const oversizedFile = {
      name: 'large.jpg',
      type: 'image/jpeg',
      size: 50000000 // 50MB
    } as File

    const oversizedResult = validateFileUpload(oversizedFile)
    if (!oversizedResult.isValid) {
      details.push('✅ Oversized file was correctly rejected')
    } else {
      passed = false
      details.push('❌ Oversized file was incorrectly accepted')
    }

    return { passed, details }
  }

  // Test 6: JWT Token Security
  static async testJWTSecurity(): Promise<{ passed: boolean; details: string[] }> {
    const details: string[] = []
    let passed = true

    try {
      // Test invalid token
      const invalidToken = 'invalid.jwt.token'
      const invalidResult = await verifyToken(invalidToken)
      
      if (invalidResult === null) {
        details.push('✅ Invalid JWT token was correctly rejected')
      } else {
        passed = false
        details.push('❌ Invalid JWT token was incorrectly accepted')
      }

      // Test malformed token
      const malformedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.malformed'
      const malformedResult = await verifyToken(malformedToken)
      
      if (malformedResult === null) {
        details.push('✅ Malformed JWT token was correctly rejected')
      } else {
        passed = false
        details.push('❌ Malformed JWT token was incorrectly accepted')
      }

    } catch (error) {
      // Expected behavior for invalid tokens
      details.push('✅ JWT validation correctly handles errors')
    }

    return { passed, details }
  }

  // Run all security tests
  static async runAllTests(): Promise<{
    overallPassed: boolean
    results: Array<{ test: string; passed: boolean; details: string[] }>
  }> {
    const results = []
    let overallPassed = true

    // Run all tests
    const tests = [
      { name: 'Password Security', test: () => this.testPasswordSecurity() },
      { name: 'Data Encryption', test: () => this.testDataEncryption() },
      { name: 'PII Detection', test: () => this.testPIIDetection() },
      { name: 'Rate Limiting', test: () => this.testRateLimiting() },
      { name: 'File Upload Security', test: () => this.testFileUploadSecurity() },
      { name: 'JWT Security', test: () => this.testJWTSecurity() }
    ]

    for (const { name, test } of tests) {
      try {
        const result = await test()
        results.push({
          test: name,
          passed: result.passed,
          details: result.details
        })
        
        if (!result.passed) {
          overallPassed = false
        }
      } catch (error) {
        results.push({
          test: name,
          passed: false,
          details: [`❌ Test failed with error: ${error}`]
        })
        overallPassed = false
      }
    }

    return { overallPassed, results }
  }
}

// Security monitoring utilities
export class SecurityMonitoring {
  
  // Check for common security misconfigurations
  static checkSecurityConfiguration(): { issues: string[]; recommendations: string[] } {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check environment variables
    if (!process.env.JWT_SECRET) {
      issues.push('JWT_SECRET environment variable is not set')
      recommendations.push('Set a strong JWT_SECRET with at least 256 bits of entropy')
    }

    if (!process.env.ENCRYPTION_KEY) {
      issues.push('ENCRYPTION_KEY environment variable is not set')
      recommendations.push('Set a strong ENCRYPTION_KEY with at least 32 characters')
    }

    if (process.env.NODE_ENV === 'production') {
      if (process.env.JWT_SECRET === 'your-super-secret-jwt-key-here') {
        issues.push('Default JWT_SECRET is being used in production')
        recommendations.push('Change JWT_SECRET to a production-ready secret')
      }

      if (!process.env.SESSION_SECRET) {
        issues.push('SESSION_SECRET is not set for production')
        recommendations.push('Set a strong SESSION_SECRET for production')
      }
    }

    return { issues, recommendations }
  }
}
