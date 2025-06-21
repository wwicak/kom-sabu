const fs = require('fs');
const path = require('path');

// Create a simple test image (1x1 pixel PNG)
const createTestImage = () => {
  // Base64 encoded 1x1 pixel transparent PNG
  const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
  return Buffer.from(base64Data, 'base64');
};

// Test upload function
async function testUpload() {
  try {
    console.log('🧪 Testing image upload functionality...');
    
    // Create test image
    const imageBuffer = createTestImage();
    
    // Create FormData
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Add file as blob
    formData.append('file', imageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    formData.append('title', 'Test Image Upload');
    formData.append('description', 'Testing image upload functionality');
    formData.append('category', 'Budaya');
    
    console.log('📤 Sending upload request...');
    
    // Make request to test upload endpoint
    const response = await fetch('http://localhost:3000/api/test-upload', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📊 Response body:', responseText);
    
    if (response.ok) {
      const result = JSON.parse(responseText);
      console.log('✅ Upload successful!');
      console.log('🖼️  Image URL:', result.data?.imageUrl);
      console.log('🖼️  Thumbnail URL:', result.data?.thumbnailUrl);
      console.log('📊 Metadata:', result.data?.metadata);
    } else {
      console.log('❌ Upload failed');
      console.log('Error:', responseText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Test file validation
async function testFileValidation() {
  console.log('\n🧪 Testing file validation...');
  
  try {
    // Test with invalid file type
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Create a fake "executable" file
    const invalidBuffer = Buffer.from('This is not an image');
    formData.append('file', invalidBuffer, {
      filename: 'malicious.exe',
      contentType: 'application/octet-stream'
    });
    formData.append('title', 'Invalid File Test');
    formData.append('description', 'Testing file validation');
    formData.append('category', 'Budaya');
    
    const response = await fetch('http://localhost:3000/api/test-upload', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders()
      }
    });
    
    const responseText = await response.text();
    console.log('📊 Validation test status:', response.status);
    console.log('📊 Validation test response:', responseText);
    
    if (response.status === 400) {
      console.log('✅ File validation working correctly - rejected invalid file');
    } else {
      console.log('❌ File validation may not be working - invalid file was accepted');
    }
    
  } catch (error) {
    console.error('❌ Validation test failed:', error.message);
  }
}

// Test oversized file
async function testOversizedFile() {
  console.log('\n🧪 Testing oversized file rejection...');
  
  try {
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Create a large buffer (15MB - should exceed 10MB limit)
    const largeBuffer = Buffer.alloc(15 * 1024 * 1024, 'a');
    formData.append('file', largeBuffer, {
      filename: 'large-image.png',
      contentType: 'image/png'
    });
    formData.append('title', 'Large File Test');
    formData.append('description', 'Testing file size validation');
    formData.append('category', 'Budaya');
    
    const response = await fetch('http://localhost:3000/api/test-upload', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders()
      }
    });
    
    const responseText = await response.text();
    console.log('📊 Size test status:', response.status);
    console.log('📊 Size test response:', responseText);
    
    if (response.status === 400 || response.status === 413) {
      console.log('✅ File size validation working correctly - rejected oversized file');
    } else {
      console.log('❌ File size validation may not be working - large file was accepted');
    }
    
  } catch (error) {
    console.error('❌ Size test failed:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting upload functionality tests...\n');
  
  await testUpload();
  await testFileValidation();
  await testOversizedFile();
  
  console.log('\n✅ All tests completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('Installing node-fetch for testing...');
  require('child_process').execSync('npm install node-fetch form-data', { stdio: 'inherit' });
  global.fetch = require('node-fetch');
}

runTests().catch(console.error);
