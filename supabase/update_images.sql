-- ============================================================
-- Paste into Supabase SQL Editor to point already-seeded rows
-- at the new local images.
-- Safe to re-run; matches rows by slug and only touches cover_image.
-- ============================================================

-- ---------- News & announcements ----------
update public.posts  set cover_image = '/assets/news-youth-center.webp'
  where slug = 'batangas-city-opens-new-youth-center';
update public.posts  set cover_image = '/assets/news-coastal-cleanup.webp'
  where slug = 'coastal-cleanup-drive-2026';
update public.posts  set cover_image = '/assets/news-wifi-plazas.webp'
  where slug = 'free-wifi-plazas-expansion';
update public.posts  set cover_image = '/assets/news-sk-summit.webp'
  where slug = 'sk-federation-leadership-summit';
update public.posts  set cover_image = '/assets/news-public-market.webp'
  where slug = 'public-market-modernization';
update public.posts  set cover_image = '/assets/news-scholarship.webp'
  where slug = 'scholarship-applications-record';
update public.posts  set cover_image = '/assets/adv-drill.webp'
  where slug = 'advisory-hazard-drill';
update public.posts  set cover_image = '/assets/adv-permit.webp'
  where slug = 'advisory-business-permit-renewal';

-- ---------- Events ----------
update public.events set cover_image = '/assets/event-basketball.webp'
  where slug = 'inter-barangay-basketball-2026';
update public.events set cover_image = '/assets/event-songwriting.webp'
  where slug = 'himig-batangan-songwriting-camp';
update public.events set cover_image = '/assets/event-bootcamp.webp'
  where slug = 'youth-leaders-bootcamp';
update public.events set cover_image = '/assets/event-mangrove.webp'
  where slug = 'mangrove-planting-wawa';
update public.events set cover_image = '/assets/event-scholarship-orientation.webp'
  where slug = 'city-college-scholarship-orientation';
update public.events set cover_image = '/assets/event-hackathon.webp'
  where slug = 'sk-budget-hackathon';
update public.events set cover_image = '/assets/event-mural.webp'
  where slug = 'mural-arts-festival';
update public.events set cover_image = '/assets/event-firstaid.webp'
  where slug = 'first-aid-certification';
