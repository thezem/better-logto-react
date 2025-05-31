# @ouim/better-logto-react

A lightweight wrapper around @logto/react that provides Clerk-like API patterns for authentication.

## Features

- Simple `AuthProvider` component that wraps Logto's provider
- User-friendly `useAuth` hook with middleware options for route protection
- `UserCenter` component with different states (signed in, signed out, loading)
- TypeScript support for enhanced developer experience

## Installation

```bash
npm install @logto/react @ouim/better-logto-react
```

## Quick Start

### 1. Configure Logto and Setup Callback

```jsx
import { AuthProvider, useAuth, UserCenter } from '@ouim/better-logto-react'

// Configure your Logto authentication
const config = {
  endpoint: 'https://your-logto-endpoint.com',
  appId: 'your-app-id',
}

// Wrap your app with the AuthProvider
function App() {
  return (
    <AuthProvider
      config={config}
      callbackUrl="http://localhost:3000/callback" // Important: Set this to match your registered redirect URI
    >
      <YourApp />
    </AuthProvider>
  )
}
```

### 2. Create a Callback Route

Create a callback route in your application to handle OAuth redirects:

**For Next.js App Router** (`app/callback/page.tsx`):

```tsx
'use client'

import { useEffect } from 'react'
import { useLogto } from '@logto/react'

export default function CallbackPage() {
  const { handleSignInCallback, isLoading } = useLogto()

  useEffect(() => {
    handleSignInCallback(window.location.href)
  }, [handleSignInCallback])

  if (isLoading) {
    return <div>Signing you in...</div>
  }

  return <div>Authentication complete!</div>
}
```

### 3. Register Redirect URI in Logto

In your Logto Console, add these redirect URIs:

- Development: `http://localhost:3000/callback`
- Production: `https://yourdomain.com/callback`

### 4. Use in Your Components

// Use the auth hook in your components function Dashboard() { const { user, isLoadingUser } = useAuth({ middleware: 'auth', redirectTo: '/login', })

if (isLoadingUser) { return <div>Loading...</div> }

return <div>Welcome {user.name}!</div> }

// Add the UserCenter component to your navigation function Navigation() { return ( <nav> <div>Your Nav Links</div> <UserCenter /> </nav> ) }

````

## API Reference

### AuthProvider

The `AuthProvider` component wraps your application and provides authentication context:

```jsx
<AuthProvider
  config={logtoConfig}
  callbackUrl="/callback" // Optional: specify the callback URL for OAuth redirect
>
  {children}
</AuthProvider>
````

**Props:**

- `config`: The Logto configuration object
- `callbackUrl` (optional): The URL to redirect to after authentication. If not provided, uses `window.location.href`

### useAuth Hook

The `useAuth` hook provides authentication state and methods:

```typescript
const {
  user, // The current user object or null
  isLoadingUser, // Boolean indicating if user data is loading
  signIn, // Function to initiate sign in
  signOut, // Function to sign out
} = useAuth({
  middleware: 'auth' | 'guest', // Optional route protection
  redirectTo: string, // Where to redirect if auth is required
  redirectIfAuthenticated: string, // Where to redirect if already authenticated
})
```

### UserCenter Component

A pre-built user menu component that handles different authentication states:

```jsx
<UserCenter className="optional-custom-class" />
```

## Types

### LogtoUser

```typescript
type LogtoUser = {
  id: string
  name?: string
  email?: string
  avatar?: string
  [key: string]: any // Additional properties from Logto
}
```

### AuthOptions

```typescript
interface AuthOptions {
  middleware?: 'auth' | 'guest' | undefined
  redirectTo?: string
  redirectIfAuthenticated?: string
}
```

## License

MIT

## Troubleshooting

### Redirect URI Mismatch Error

If you get an error like `redirect_uri did not match any of the client's registered redirect_uris`, you need to:

1. **Create a callback route** in your application (e.g., `/callback`)
2. **Configure the callback URL** in your AuthProvider:
   ```jsx
   <AuthProvider config={config} callbackUrl="http://yourdomain.com/callback">
     <YourApp />
   </AuthProvider>
   ```
3. **Register the callback URL** in your Logto application settings under "Redirect URIs"

### Jose Library Module Resolution Error

If you encounter errors related to `jose` library module resolution when using this library in your project, you can use our bundler configuration helper:

#### Option 1: Use the configuration helper (Recommended)

```javascript
import { viteConfig } from '@ouim/better-logto-react'

export default defineConfig({
  ...viteConfig,
  // your other config
})
```

#### Option 2: Manual configuration

Add to your `vite.config.js`:

```javascript
export default defineConfig({
  optimizeDeps: {
    include: ['@logto/react', '@ouim/better-logto-react'],
  },
  resolve: {
    alias: {
      // Force jose to use the node version
      jose: 'jose/dist/node/cjs',
    },
  },
})
```

#### For Next.js projects:

Add to your `next.config.js`:

```javascript
module.exports = {
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      jose: 'jose/dist/node/cjs',
    }
    return config
  },
}
```

#### For Create React App:

Install `@craco/craco` and create a `craco.config.js`:

```javascript
module.exports = {
  webpack: {
    alias: {
      jose: 'jose/dist/node/cjs',
    },
  },
}
```
