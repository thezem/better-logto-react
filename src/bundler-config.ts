// Configuration helper for resolving jose library issues
// This can be imported and used in consuming project's bundler configuration

interface BundlerConfig {
  optimizeDeps?: {
    include: string[]
  }
  resolve?: {
    alias: Record<string, string>
  }
  alias?: Record<string, string>
}

export const getBundlerConfig = (bundler: 'vite' | 'webpack' | 'nextjs' = 'vite'): BundlerConfig => {
  const joseAlias = {
    jose: 'jose/dist/node/cjs',
  }

  switch (bundler) {
    case 'vite':
      return {
        optimizeDeps: {
          include: ['@logto/react', '@better-logto/react'],
        },
        resolve: {
          alias: joseAlias,
        },
      }

    case 'webpack':
    case 'nextjs':
      return {
        resolve: {
          alias: joseAlias,
        },
      }

    default:
      return { alias: joseAlias }
  }
}

export const viteConfig = getBundlerConfig('vite')
export const webpackConfig = getBundlerConfig('webpack')
export const nextjsConfig = getBundlerConfig('nextjs')
