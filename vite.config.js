import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BetterLogtoReact',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@logto/react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@logto/react': 'LogtoReact',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@logto/react'],
  },
})
