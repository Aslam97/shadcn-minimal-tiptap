import * as React from 'react'
import { Helmet } from 'react-helmet-async'

export const SEO: React.FC = () => {
  const title = 'Minimal Tiptap - Streamlined Rich Text Editing for React'
  const description =
    'Experience effortless rich text editing with Minimal Tiptap. A lightweight, customizable editor built on Tiptap for React applications. Boost your content creation with minimal setup.'
  const canonical = 'https://shadcn-minimal-tiptap.vercel.app'
  const ogImage = 'https://i.postimg.cc/4yntFTn8/Screenshot-2024-08-30-at-04-54-46.png'
  const author = 'Aslam'
  const twitterHandle = '@asuramus__'

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href={canonical} />

      {/* Author Information */}
      <meta name="author" content={author} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Minimal Tiptap" />
      <meta property="og:author" content={author} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Keywords */}
      <meta
        name="keywords"
        content="Minimal Tiptap, React rich text editor, lightweight editor, Tiptap, content creation, WYSIWYG editor, Aslam"
      />

      {/* Additional meta tags */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  )
}
