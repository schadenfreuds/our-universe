import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Mini local API plugin for the Admin Dashboard to save content without external backend!
function localApiPlugin() {
  return {
    name: 'local-api',
    configureServer(server) {
      // Endpoint 1: Save story data to src/data/story.json
      server.middlewares.use('/api/save-story', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              const filePath = path.resolve(__dirname, 'src/data/story.json')
              fs.mkdirSync(path.dirname(filePath), { recursive: true })
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, message: 'Hikaye başarıyla kaydedildi!' }))
            } catch (err) {
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
        } else {
          res.statusCode = 405
          res.end()
        }
      })

      // Endpoint 2: Upload photo to public/photos/
      server.middlewares.use('/api/upload-photo', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const { filename, base64 } = JSON.parse(body)
              const photosDir = path.resolve(__dirname, 'public/photos')
              fs.mkdirSync(photosDir, { recursive: true })
              
              // Remove data URI prefix if present
              const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
              const buffer = Buffer.from(base64Data, 'base64')
              
              const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_')
              const filePath = path.join(photosDir, safeFilename)
              fs.writeFileSync(filePath, buffer)

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ 
                success: true, 
                url: `/photos/${safeFilename}`,
                filename: safeFilename 
              }))
            } catch (err) {
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
        } else {
          res.statusCode = 405
          res.end()
        }
      })

      // Endpoint 3: List photos in public/photos/
      server.middlewares.use('/api/list-photos', (req, res) => {
        if (req.method === 'GET') {
          try {
            const photosDir = path.resolve(__dirname, 'public/photos')
            fs.mkdirSync(photosDir, { recursive: true })
            const files = fs.readdirSync(photosDir).filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, photos: files.map(f => `/photos/${f}`) }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
        } else {
          res.statusCode = 405
          res.end()
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localApiPlugin(),
  ],
})
