# @ouim/simple-logto

A simpler way to use [@logto/react](https://github.com/logto-io/logto) with prebuilt UI components and hooks for fast authentication setup in React apps.

---

## Features

- **AuthProvider**: Easy context provider for Logto authentication.
- **UserCenter**: Prebuilt user dropdown/avatar for your navbar.
- **CallbackPage**: Handles OAuth callback and popup flows.
- **useAuth**: React hook for accessing user and auth actions.
- **Custom navigation**: Integrates with React Router, Next.js, etc.

---

## Installation

```sh
npm install @ouim/simple-logto
```

---

## 1. AuthProvider

Wrap your app with `AuthProvider` and pass your Logto config:

```tsx
import { AuthProvider } from '@ouim/simple-logto'

const config = {
  endpoint: 'https://your-logto-endpoint.com',
  appId: 'your-app-id',
}

function App() {
  return (
    <AuthProvider
      config={config}
      callbackUrl="http://localhost:3000/callback"
      // Optionally: customNavigate for SPA routing
      // customNavigate={(url, options) => { ... }}
    >
      <YourApp />
    </AuthProvider>
  )
}
```

---

## 2. UserCenter Component

Drop the `UserCenter` component into your navbar for a ready-to-use user menu:

```tsx
import { UserCenter } from '@ouim/simple-logto'

function Navbar() {
  return (
    <nav className="flex items-center justify-between h-16 px-4 border-b">
      <div className="font-bold">MyApp</div>
      <UserCenter />
    </nav>
  )
}
```

- Shows avatar, name, and sign out when authenticated.
- Shows sign in button when not authenticated.
- Accepts optional props:
  - `className`
  - `signoutCallbackUrl` (defaults to `/`)

---

## 3. CallbackPage

Create a route (e.g. `/callback`) and render `CallbackPage` to handle OAuth redirects:

```tsx
import { CallbackPage } from '@ouim/simple-logto'

export default function Callback() {
  return <CallbackPage />
}
```

- Handles both normal and popup sign-in flows.
- Optional props:
  - `onSuccess`, `onError`, `loadingComponent`, `successComponent`

---

## 4. useAuth Hook

Access the current user and authentication actions anywhere in your app:

```tsx
import { useAuth } from '@ouim/simple-logto'

function Dashboard() {
  const { user, isLoadingUser, signIn, signOut } = useAuth()

  if (isLoadingUser) return <div>Loading...</div>
  if (!user) return <button onClick={() => signIn()}>Sign in</button>

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
```

### Route Protection Example

```tsx
function ProtectedPage() {
  const { user } = useAuth({
    middleware: 'auth',
    redirectTo: '/login', // Redirect if not authenticated
  })

  if (!user) return null // or loading indicator
  return <div>Protected content</div>
}
```

---
