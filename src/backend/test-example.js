// Simple test example for the Logto backend verification
// This is not a real test file, just for demonstration

const { verifyAuth } = require('@ouim/simple-logto/backend')

async function testVerification() {
  try {
    // Example with a mock request object
    const mockRequest = {
      cookies: {
        logto_authtoken: 'your-jwt-token-here',
      },
      headers: {
        authorization: 'Bearer your-jwt-token-here',
      },
    }

    const options = {
      logtoUrl: 'https://your-logto-domain.com',
      audience: 'your-api-resource-identifier',
      requiredScope: 'read:profile',
    }

    const auth = await verifyAuth(mockRequest, options)

    console.log('✅ Verification successful!')
    console.log('User ID:', auth.userId)
    console.log('Is Authenticated:', auth.isAuthenticated)
    console.log('Scopes:', auth.payload.scope)
  } catch (error) {
    console.log('❌ Verification failed:', error.message)
  }
}

// Uncomment to test with real tokens
// testVerification();

console.log('🚀 Logto backend verification ready!')
console.log('Replace the mock token and options with real values to test.')
