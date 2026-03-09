# Flylens Website Design

## Overview
Website for Flylens, a drone stock videography business. Showcases portfolio, links to stock platforms, and offers client work services.

## Tech Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Sanity CMS** for portfolio videos and client work
- **Mux** for video hosting (signed URLs + watermark)
- **next-intl** for NL/EN language switch
- **Vercel** for hosting

## Brand
- Name: Flylens
- Slogan: "A new angle on the world"
- Primary/Background: #02172D (dark navy)
- Accent: #33C6F2 (bright blue)
- Text: #FFFFFF + light grey variants
- Logos available in: icon, with slogan, without slogan (white, color, black variants)

## Pages

### 1. Homepage
- Hero section with background drone video (autoplay, muted, loop) + logo + slogan
- Stock platform links as styled cards (Shutterstock, Adobe Stock, Pond5, Dreamstime)
- Social media links (Instagram, LinkedIn)
- CTA to portfolio and contact

### 2. Portfolio
- Grid of video previews (10 sec, max 1080p via Mux)
- Protected: signed URLs, no download button, watermark
- Lazy loading + poster thumbnails
- Managed via Sanity CMS

### 3. Client Work (Klantenwerk)
- Project cards with title, description, thumbnail/video
- "Coming soon" state while no projects exist
- Managed via Sanity CMS

### 4. About
- Photo + story about the pilot and Flylens
- Equipment/expertise section
- Hardcoded (developer managed)

### 5. Contact
- Contact form (name, email, message)
- Server action or API route for email delivery
- Social media links

## Layout
- Sticky navbar: logo, nav links, language switch (NL/EN)
- Footer: social links, stock platform links, copyright

## Video Protection (Mux)
- Signed playback URLs (short expiry)
- Visible FlyLens watermark overlay
- Right-click/download disabled on player
- Max 1080p quality (4K originals stay on stock platforms)

## CMS Schemas (Sanity)
- **Portfolio item**: title, description, Mux video ID, tags, order
- **Client work project**: title, description, media (video/photos), date

## External Links
- Instagram: https://www.instagram.com/flylensw/
- LinkedIn: https://www.linkedin.com/in/wout-wybo-253860367/
- Adobe Stock: https://stock.adobe.com/contributor/211750229/FlyLens
- Shutterstock: https://submit.shutterstock.com/nl/FlyLens
- Pond5: https://www.pond5.com/nl/artist/flylensw180
- Dreamstime: https://nl.dreamstime.com/flylensw_info

## Hosting
- Vercel (free tier) for Next.js app
- Sanity (free tier) for CMS
- Mux (free tier, 10GB) for video
