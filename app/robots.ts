import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',        // Protect API routes
        '/login/',      // Protect auth routes
        '/register/',   // Protect auth routes
        '/protected/', // Protect protected folder
      ],
    },
    sitemap: 'https://ica-app-teal.vercel.app/sitemap.xml',
  }
}