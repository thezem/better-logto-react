import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'backend/index': resolve(__dirname, 'src/backend/index.ts'),
      },
      name: 'BetterLogtoReact',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@logto/react', 'jose'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@logto/react': 'LogtoReact',
          jose: 'jose',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@logto/react'],
  },
})
