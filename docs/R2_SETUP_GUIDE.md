# Cloudflare R2 Object Storage Setup Guide

This guide will help you set up Cloudflare R2 Object Storage for the Sabu Raijua government website.

## Prerequisites

- Cloudflare account
- Access to Cloudflare Dashboard
- Basic understanding of object storage concepts

## Step 1: Create R2 Bucket

1. **Login to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **R2 Object Storage**

2. **Create a New Bucket**
   - Click **"Create bucket"**
   - Enter bucket name: `sabu-raijua-assets`
   - Choose location: **Asia Pacific (APAC)** for better performance
   - Click **"Create bucket"**

## Step 2: Generate R2 API Tokens

1. **Navigate to R2 API Tokens**
   - In R2 Object Storage dashboard
   - Click **"Manage R2 API tokens"**

2. **Create API Token**
   - Click **"Create API token"**
   - **Token name**: `sabu-raijua-website`
   - **Permissions**: 
     - ✅ Object Read
     - ✅ Object Write
     - ✅ Object Delete
   - **Bucket restrictions**: Select `sabu-raijua-assets`
   - Click **"Create API token"**

3. **Save Credentials**
   - **Access Key ID**: Copy and save securely
   - **Secret Access Key**: Copy and save securely
   - ⚠️ **Important**: Secret key is only shown once!

## Step 3: Get Account Information

1. **Find Account ID**
   - In Cloudflare Dashboard sidebar
   - Look for **Account ID** in the right panel
   - Copy the Account ID

2. **Construct R2 Endpoint**
   - Format: `https://[ACCOUNT_ID].r2.cloudflarestorage.com`
   - Example: `https://abc123def456.r2.cloudflarestorage.com`

## Step 4: Configure Environment Variables

Update your `.env.local` file:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=your_actual_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_actual_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_actual_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=sabu-raijua-assets
CLOUDFLARE_R2_ENDPOINT=https://your_actual_account_id.r2.cloudflarestorage.com
CLOUDFLARE_CDN_URL=https://assets.saburajuakab.go.id
```

## Step 5: Test Configuration

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test R2 Connection**
   - Login as admin
   - Navigate to: `http://localhost:3000/api/admin/test-r2`
   - Check the response for configuration status

3. **Alternative: Use Test Utility**
   ```typescript
   import { testR2Connection } from '@/lib/r2-test'
   
   const result = await testR2Connection()
   console.log(result)
   ```

## Step 6: Set Up Custom Domain (Optional but Recommended)

1. **Add Custom Domain to R2 Bucket**
   - In bucket settings, click **"Custom Domains"**
   - Add domain: `assets.saburajuakab.go.id`
   - Follow DNS configuration instructions

2. **Update CDN URL**
   ```env
   CLOUDFLARE_CDN_URL=https://assets.saburajuakab.go.id
   ```

## Security Best Practices

### 1. API Token Permissions
- ✅ Use least privilege principle
- ✅ Restrict to specific bucket only
- ✅ Regularly rotate API tokens
- ❌ Don't use account-level permissions

### 2. Bucket Configuration
- ✅ Enable versioning for important files
- ✅ Set up lifecycle policies for old files
- ✅ Configure CORS if needed for direct uploads

### 3. Environment Variables
- ✅ Never commit real credentials to git
- ✅ Use different buckets for dev/staging/production
- ✅ Rotate credentials regularly

## Troubleshooting

### Common Issues

1. **"Access Denied" Error**
   - Check API token permissions
   - Verify bucket name is correct
   - Ensure token is not expired

2. **"Bucket Not Found" Error**
   - Verify bucket name spelling
   - Check if bucket exists in correct account
   - Ensure account ID is correct

3. **"Invalid Endpoint" Error**
   - Verify endpoint format: `https://[account-id].r2.cloudflarestorage.com`
   - Check account ID is correct
   - Ensure no extra characters or spaces

### Testing Commands

```bash
# Test R2 configuration
curl -X GET http://localhost:3000/api/admin/test-r2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test file upload
curl -X POST http://localhost:3000/api/admin/test-r2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## File Upload Features

The R2 implementation includes:

- ✅ **Image Optimization**: Automatic WebP conversion and resizing
- ✅ **Thumbnail Generation**: Automatic thumbnail creation for images
- ✅ **File Validation**: Type and size validation
- ✅ **Secure Filenames**: Cryptographically secure filename generation
- ✅ **Metadata Storage**: File metadata and upload information
- ✅ **Batch Operations**: Bulk upload and delete operations
- ✅ **CDN Integration**: Optimized delivery through Cloudflare CDN

## Monitoring and Maintenance

1. **Monitor Usage**
   - Check R2 dashboard for storage usage
   - Monitor bandwidth and request metrics
   - Set up billing alerts

2. **Regular Maintenance**
   - Clean up test files periodically
   - Review and rotate API tokens
   - Update bucket policies as needed

3. **Backup Strategy**
   - Consider cross-region replication for critical files
   - Implement regular backup procedures
   - Document recovery procedures

## Cost Optimization

- Use lifecycle policies to automatically delete old files
- Optimize image sizes and formats
- Implement caching strategies
- Monitor and analyze usage patterns

For more information, visit the [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/).
