import CryptoJS from 'crypto-js'
import { z } from 'zod'

// Data classification levels
export enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted'
}

// PII (Personally Identifiable Information) types
export enum PIIType {
  NAME = 'name',
  EMAIL = 'email',
  PHONE = 'phone',
  ADDRESS = 'address',
  ID_NUMBER = 'id_number',
  FINANCIAL = 'financial',
  BIOMETRIC = 'biometric'
}

interface EncryptionConfig {
  algorithm: string
  keySize: number
  ivSize: number
}

const ENCRYPTION_CONFIG: EncryptionConfig = {
  algorithm: 'AES',
  keySize: 256,
  ivSize: 128
}

// Enhanced encryption for sensitive data
export class DataProtection {
  private static getEncryptionKey(): string {
    const key = process.env.ENCRYPTION_KEY
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable is required')
    }
    if (key.length < 32) {
      throw new Error('ENCRYPTION_KEY must be at least 32 characters long')
    }
    return key
  }

  // Encrypt sensitive data with metadata
  static encryptSensitiveData(
    data: string, 
    classification: DataClassification = DataClassification.CONFIDENTIAL,
    piiType?: PIIType
  ): string {
    try {
      const key = this.getEncryptionKey()
      const iv = CryptoJS.lib.WordArray.random(ENCRYPTION_CONFIG.ivSize / 8)
      
      const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })

      // Create metadata
      const metadata = {
        algorithm: ENCRYPTION_CONFIG.algorithm,
        classification,
        piiType,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }

      // Combine IV, encrypted data, and metadata
      const result = {
        iv: iv.toString(),
        data: encrypted.toString(),
        metadata
      }

      return Buffer.from(JSON.stringify(result)).toString('base64')
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error('Failed to encrypt sensitive data')
    }
  }

  // Decrypt sensitive data
  static decryptSensitiveData(encryptedData: string): {
    data: string
    metadata: any
  } {
    try {
      const key = this.getEncryptionKey()
      const parsed = JSON.parse(Buffer.from(encryptedData, 'base64').toString())
      
      const iv = CryptoJS.enc.Hex.parse(parsed.iv)
      const decrypted = CryptoJS.AES.decrypt(parsed.data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })

      const decryptedData = decrypted.toString(CryptoJS.enc.Utf8)
      
      if (!decryptedData) {
        throw new Error('Decryption failed - invalid data or key')
      }

      return {
        data: decryptedData,
        metadata: parsed.metadata
      }
    } catch (error) {
      console.error('Decryption failed:', error)
      throw new Error('Failed to decrypt sensitive data')
    }
  }

  // Hash sensitive data for searching (one-way)
  static hashForSearch(data: string, salt?: string): string {
    const searchSalt = salt || process.env.SEARCH_SALT || 'default-search-salt'
    return CryptoJS.SHA256(data + searchSalt).toString()
  }

  // Mask PII data for display
  static maskPII(data: string, type: PIIType): string {
    switch (type) {
      case PIIType.EMAIL:
        const [username, domain] = data.split('@')
        if (!domain) return '***@***.***'
        return `${username.substring(0, 2)}***@${domain}`
      
      case PIIType.PHONE:
        return data.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
      
      case PIIType.NAME:
        const names = data.split(' ')
        return names.map((name, index) => 
          index === 0 ? name : name.charAt(0) + '*'.repeat(name.length - 1)
        ).join(' ')
      
      case PIIType.ID_NUMBER:
        return data.replace(/\d(?=\d{4})/g, '*')
      
      case PIIType.ADDRESS:
        return data.substring(0, 10) + '***'
      
      default:
        return '***'
    }
  }

  // Validate data classification
  static validateClassification(classification: string): boolean {
    return Object.values(DataClassification).includes(classification as DataClassification)
  }

  // Generate secure token for data access
  static generateAccessToken(userId: string, dataId: string, expiresIn: number = 3600): string {
    const payload = {
      userId,
      dataId,
      exp: Math.floor(Date.now() / 1000) + expiresIn,
      iat: Math.floor(Date.now() / 1000)
    }
    
    return this.encryptSensitiveData(JSON.stringify(payload), DataClassification.RESTRICTED)
  }

  // Verify access token
  static verifyAccessToken(token: string): { userId: string; dataId: string } | null {
    try {
      const { data } = this.decryptSensitiveData(token)
      const payload = JSON.parse(data)
      
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null // Token expired
      }
      
      return {
        userId: payload.userId,
        dataId: payload.dataId
      }
    } catch {
      return null
    }
  }
}

// PII Detection utility
export class PIIDetector {
  private static patterns = {
    [PIIType.EMAIL]: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    [PIIType.PHONE]: /(\+\d{1,3}[- ]?)?\d{10,}/g,
    [PIIType.ID_NUMBER]: /\b\d{16}\b|\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    [PIIType.FINANCIAL]: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
  }

  static detectPII(text: string): { type: PIIType; matches: string[] }[] {
    const results: { type: PIIType; matches: string[] }[] = []
    
    for (const [type, pattern] of Object.entries(this.patterns)) {
      const matches = text.match(pattern)
      if (matches) {
        results.push({
          type: type as PIIType,
          matches: [...new Set(matches)] // Remove duplicates
        })
      }
    }
    
    return results
  }

  static sanitizePII(text: string): string {
    let sanitized = text
    
    for (const [type, pattern] of Object.entries(this.patterns)) {
      sanitized = sanitized.replace(pattern, (match) => 
        DataProtection.maskPII(match, type as PIIType)
      )
    }
    
    return sanitized
  }
}

// Data retention policy
export class DataRetention {
  private static retentionPolicies = {
    [DataClassification.PUBLIC]: 365 * 5, // 5 years
    [DataClassification.INTERNAL]: 365 * 3, // 3 years
    [DataClassification.CONFIDENTIAL]: 365 * 7, // 7 years
    [DataClassification.RESTRICTED]: 365 * 10 // 10 years
  }

  static getRetentionPeriod(classification: DataClassification): number {
    return this.retentionPolicies[classification]
  }

  static isExpired(createdAt: Date, classification: DataClassification): boolean {
    const retentionDays = this.getRetentionPeriod(classification)
    const expiryDate = new Date(createdAt.getTime() + (retentionDays * 24 * 60 * 60 * 1000))
    return new Date() > expiryDate
  }

  static getExpiryDate(createdAt: Date, classification: DataClassification): Date {
    const retentionDays = this.getRetentionPeriod(classification)
    return new Date(createdAt.getTime() + (retentionDays * 24 * 60 * 60 * 1000))
  }
}

// Audit trail for data access
export interface DataAccessLog {
  userId: string
  dataId: string
  action: 'read' | 'write' | 'delete' | 'export'
  classification: DataClassification
  timestamp: Date
  ipAddress: string
  userAgent: string
  success: boolean
  reason?: string
}

export class DataAudit {
  static async logDataAccess(log: DataAccessLog): Promise<void> {
    try {
      // In production, this should write to a secure audit log system
      console.log('Data Access Log:', {
        ...log,
        timestamp: log.timestamp.toISOString()
      })
      
      // TODO: Implement secure audit logging to database or external service
    } catch (error) {
      console.error('Failed to log data access:', error)
    }
  }
}

// Validation schemas for data protection
export const dataClassificationSchema = z.nativeEnum(DataClassification)
export const piiTypeSchema = z.nativeEnum(PIIType)

export const sensitiveDataSchema = z.object({
  data: z.string(),
  classification: dataClassificationSchema,
  piiType: piiTypeSchema.optional(),
  retentionPeriod: z.number().optional()
})
