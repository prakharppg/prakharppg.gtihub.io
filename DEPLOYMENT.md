# Deployment Guide

## GitHub Pages
1. Push this project to a GitHub repository.
2. Open **Settings > Pages**.
3. Deploy from the `main` branch root.
4. Add a custom domain in GitHub Pages settings.
5. In your DNS provider:
   - use a `CNAME` record for `www`
   - or configure `A` records for the apex/root domain
6. If you use a custom domain, create a `CNAME` file in the repo root containing your final domain.

## Supabase Setup
1. Create a new Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Copy your project URL and anon key.
4. Update `assets/js/supabase-config.js`.
5. Test both forms on `contact.html`.

## Files to update for production
- `assets/js/supabase-config.js`
- `CNAME` (create this when final domain is ready)
- canonical URLs in HTML if your final domain differs from `https://akstarentertainment.com`
- `sitemap.xml`
- `robots.txt`

## Security note
- Never put the Supabase service role key in frontend code.
- Only use the anon key in this project.
- For stronger anti-spam/security later, move submissions to a Supabase Edge Function.
