-- ============================================================
-- Batangas City Youth E-Civic Hub — Seed Data
-- Run AFTER schema.sql. Dates are relative to now() so the demo
-- always shows upcoming events. All names/numbers are placeholders.
-- ============================================================

-- ---------- News & announcements (6 news + 2 announcements) ----------
insert into public.posts (slug, title, excerpt, body, cover_image, type, category, status, published_at) values
('batangas-city-opens-new-youth-center', 'Batangas City Opens New Youth Innovation Center',
 'A new hub for coding bootcamps, maker workshops, and student organizations opens at the city proper.',
 '<p>The City Government of Batangas inaugurated the <strong>Youth Innovation Center</strong>, a two-storey facility offering free co-working spaces, computer laboratories, and meeting rooms for accredited youth organizations.</p><p>The center will host regular coding bootcamps, robotics workshops, and entrepreneurship clinics in partnership with local universities. Membership is free for residents aged 15–30.</p><p>"This is an investment in the next generation of Batangueño leaders," the City Mayor said during the ribbon-cutting.</p>',
 '/assets/news-youth-center.webp', 'news', 'Youth', 'published', now() - interval '2 days'),
('coastal-cleanup-drive-2026', 'Over 1,200 Volunteers Join Coastal Cleanup Drive',
 'Students and civic groups collected 3.5 tons of waste along Batangas Bay in this year''s biggest cleanup.',
 '<p>More than 1,200 volunteers — most of them senior high school and college students — joined the city-wide coastal cleanup along Batangas Bay last weekend.</p><p>The City Environment and Natural Resources Office (CENRO) reported 3.5 tons of collected waste, a record turnout for the annual drive.</p><p>Participating schools earned community service credits, and the top three student organizations received grants for their environmental projects.</p>',
 '/assets/news-coastal-cleanup.webp', 'news', 'Environment', 'published', now() - interval '5 days'),
('free-wifi-plazas-expansion', 'Free Public Wi-Fi Now Live in 15 Barangay Plazas',
 'The city expands its free connectivity program to 15 more plazas and covered courts.',
 '<p>Fifteen additional barangay plazas and covered courts now have free public Wi-Fi under the city''s digital inclusion program.</p><p>Each site offers speeds of up to 100 Mbps with a daily allocation per device. The city targets all 105 barangays by next year.</p>',
 '/assets/news-wifi-plazas.webp', 'news', 'Infrastructure', 'published', now() - interval '9 days'),
('sk-federation-leadership-summit', 'SK Federation Holds City-Wide Leadership Summit',
 'Over 300 SK officials gathered for training on project planning, budgeting, and youth governance.',
 '<p>The Sangguniang Kabataan (SK) Federation of Batangas City held its annual Leadership Summit, gathering more than 300 SK chairpersons and kagawads from all barangays.</p><p>Sessions covered the Youth Development Plan, CBYDP budgeting, and transparency reporting. The summit closed with a pledge to publish barangay youth budgets online.</p>',
 '/assets/news-sk-summit.webp', 'news', 'Youth', 'published', now() - interval '14 days'),
('public-market-modernization', 'Public Market Modernization Enters Phase 2',
 'Renovation of the wet section and a new rooftop solar array begin this quarter.',
 '<p>Phase 2 of the Batangas City Public Market modernization begins this quarter, covering the wet section, drainage upgrades, and a rooftop solar installation expected to cut the market''s power costs by 40%.</p><p>Stall owners will be temporarily relocated to the annex building; the city has published the relocation schedule and assistance desk hotlines.</p>',
 '/assets/news-public-market.webp', 'news', 'Infrastructure', 'published', now() - interval '20 days'),
('scholarship-applications-record', 'City Scholarship Program Receives Record 4,000 Applications',
 'The expanded college scholarship program doubles its slots for the coming academic year.',
 '<p>The city''s expanded college scholarship program received a record 4,000 applications this year. The Sangguniang Panlungsod approved additional funding, doubling available slots to 1,000.</p><p>Priority is given to students from low-income households, solo-parent families, and indigenous communities. Results will be released on the city website.</p>',
 '/assets/news-scholarship.webp', 'news', 'Education', 'published', now() - interval '26 days'),
('advisory-hazard-drill', 'ADVISORY: City-Wide Earthquake Drill on the 25th',
 'All offices, schools, and establishments are enjoined to participate in the quarterly shake drill.',
 '<p>The City Disaster Risk Reduction and Management Office (CDRRMO) will conduct the quarterly city-wide earthquake drill on the 25th, 9:00 AM. Sirens will sound across all barangays.</p>',
 '/assets/adv-drill.webp', 'announcement', 'Advisory', 'published', now() - interval '1 day'),
('advisory-business-permit-renewal', 'Business Permit Renewal Extended Until End of the Month',
 'The One-Stop Shop at the City Hall lobby is open Monday–Saturday, 8AM–5PM.',
 '<p>The deadline for business permit renewal has been extended until the end of the month. The One-Stop Shop at the City Hall lobby processes renewals Monday to Saturday, 8:00 AM – 5:00 PM. Bring your previous permit and barangay clearance.</p>',
 '/assets/adv-permit.webp', 'announcement', 'Advisory', 'published', now() - interval '3 days');

-- ---------- Youth events (8, across categories) ----------
insert into public.events (slug, title, summary, body, cover_image, category, starts_at, ends_at, venue, organizer, capacity, status) values
('inter-barangay-basketball-2026', 'Inter-Barangay Youth Basketball League',
 'Open registration for the annual 3x3 and 5x5 leagues. Ages 15–24, barangay-based teams.',
 '<p>The city''s biggest youth sports event returns. Register your barangay team for the 3x3 and 5x5 divisions. Game balls, jerseys, and officiating are covered by the city sports program.</p><p><strong>Requirements:</strong> barangay certification, school ID or birth certificate, parental consent for minors.</p>',
 '/assets/event-basketball.webp', 'Sports', now() + interval '12 days', now() + interval '40 days',
 'Batangas City Sports Coliseum', 'City Sports Development Office', 320, 'published'),
('himig-batangan-songwriting-camp', 'Himig Batangan: Youth Songwriting Camp',
 'A 3-day camp with Batangueño musicians. Write, arrange, and record an original song about the city.',
 '<p>Work with professional musicians and producers in a 3-day songwriting camp. The best three songs will be recorded in a studio and featured in the city''s founding anniversary program.</p>',
 '/assets/event-songwriting.webp', 'Arts', now() + interval '18 days', now() + interval '20 days',
 'Youth Innovation Center, P. Burgos St.', 'City Tourism, Culture & Arts Office', 60, 'published'),
('youth-leaders-bootcamp', 'Batangueño Youth Leaders Bootcamp',
 'Weekend intensive on public speaking, project management, and community organizing for student leaders.',
 '<p>A weekend intensive for student council officers, org leaders, and SK officials. Modules include public speaking, stakeholder mapping, project proposal writing, and a pitching session judged by city department heads.</p>',
 '/assets/event-bootcamp.webp', 'Leadership', now() + interval '9 days', now() + interval '10 days',
 'City Convention Center', 'City Youth Development Office', 150, 'published'),
('mangrove-planting-wawa', 'Mangrove Planting at Wawa Estuary',
 'Half-day volunteering: plant 2,000 propagules with CENRO. Certificates and snacks provided.',
 '<p>Join CENRO and partner NGOs in planting 2,000 mangrove propagules at the Wawa estuary. Transportation from City Hall is provided. Wear clothes you don''t mind getting muddy!</p><p>Community service certificates will be issued to all volunteers.</p>',
 '/assets/event-mangrove.webp', 'Volunteering', now() + interval '6 days', now() + interval '6 days',
 'Brgy. Wawa Estuary', 'CENRO Batangas City', 200, 'published'),
('city-college-scholarship-orientation', 'City College Scholarship: Application Orientation',
 'Mandatory orientation for new applicants to the city college scholarship program. Bring report cards.',
 '<p>Orientation for the city scholarship program covering eligibility, required documents, and the online application portal. Attendance is required for all first-time applicants.</p><p><strong>Bring:</strong> Form 138/report card, barangay certificate of residency, and one valid ID.</p>',
 '/assets/event-scholarship-orientation.webp', 'Scholarships', now() + interval '4 days', now() + interval '4 days',
 'City Hall Session Hall', 'City Scholarship Office', 400, 'published'),
('sk-budget-hackathon', 'SK Open Data Day: Budget Transparency Hackathon',
 'Build dashboards from real (anonymized) SK budget data. Open to students and young developers.',
 '<p>Teams of 2–4 will build visualizations and dashboards from anonymized SK budget datasets. No coding experience required for the "paper prototype" division. Prizes for the top three teams in each division.</p>',
 '/assets/event-hackathon.webp', 'SK Programs', now() + interval '25 days', now() + interval '26 days',
 'Youth Innovation Center, P. Burgos St.', 'SK Federation of Batangas City', 120, 'published'),
('mural-arts-festival', 'Sining Kalye: Youth Mural Arts Festival',
 'Paint an 80-meter community mural along the boulevard. Materials provided; walk-ins welcome for viewing.',
 '<p>Selected young artists will paint an 80-meter mural celebrating Batangueño heritage along the boulevard. Registered participants get materials, meals, and an artist fee. The public is invited to the closing viewing night with live performances.</p>',
 '/assets/event-mural.webp', 'Arts', now() + interval '32 days', now() + interval '34 days',
 'Batangas City Boulevard', 'City Tourism, Culture & Arts Office', 80, 'published'),
('first-aid-certification', 'Free First Aid & BLS Certification for Youth Volunteers',
 'Get Red Cross-certified in basic life support. Priority for barangay youth emergency response teams.',
 '<p>A full-day certification course on first aid and basic life support (BLS), delivered with the Philippine Red Cross Batangas Chapter. Graduates join the barangay youth emergency response network.</p>',
 '/assets/event-firstaid.webp', 'Volunteering', now() + interval '15 days', now() + interval '15 days',
 'CDRRMO Training Hall', 'CDRRMO & Philippine Red Cross', 100, 'published');

-- ---------- Legislation (10) ----------
insert into public.legislation (kind, number, title, summary, date_approved, status) values
('ordinance', 'CO 2026-012', 'Batangas City Youth Development and Empowerment Code',
 'Consolidates all youth programs, institutionalizes the Youth Development Council, and mandates an annual youth budget report.', current_date - 45, 'published'),
('ordinance', 'CO 2026-008', 'Single-Use Plastics Regulation Ordinance',
 'Phases out single-use plastic bags and utensils in markets and food establishments over 18 months.', current_date - 90, 'published'),
('ordinance', 'CO 2025-031', 'Public Wi-Fi and Digital Inclusion Ordinance',
 'Establishes free public internet access points in all barangays and an annual digital literacy program.', current_date - 240, 'published'),
('resolution', 'CR 2026-055', 'Resolution Adopting the 2026–2028 City Youth Development Plan',
 'Adopts the three-year youth development plan prepared by the City Youth Development Council.', current_date - 30, 'published'),
('resolution', 'CR 2026-041', 'Resolution Declaring Support for the Batangas Bay Rehabilitation Program',
 'Expresses full support and allocates counterpart funding for the multi-year bay rehabilitation program.', current_date - 75, 'published'),
('executive_order', 'EO 2026-07', 'Creating the One-Stop Shop for Business Permits and Licensing',
 'Consolidates permit processing into a single lane at City Hall with a 3-day standard processing time.', current_date - 60, 'published'),
('executive_order', 'EO 2026-03', 'Institutionalizing the Quarterly City-Wide Disaster Preparedness Drill',
 'Directs all offices, schools, and establishments to participate in quarterly earthquake and fire drills.', current_date - 150, 'published'),
('administrative_order', 'AO 2026-11', 'Guidelines on the Use of the Youth Innovation Center',
 'Sets booking rules, free-use hours for accredited youth organizations, and care-of-facility standards.', current_date - 20, 'published'),
('administrative_order', 'AO 2025-19', 'Adoption of the Citizen''s Charter 3rd Edition',
 'Updates service standards, fees, and processing times for all frontline city services.', current_date - 300, 'published'),
('proclamation', 'PROC 2026-02', 'Declaring the Month of August as Batangas City Youth Month',
 'Declares August as Youth Month with city-funded sports, arts, and civic engagement activities.', current_date - 40, 'published');

-- ---------- Transparency documents (5) + downloadable forms ----------
insert into public.documents (title, description, category, office, year, status) values
('Annual Budget FY 2026', 'Approved annual appropriations ordinance with sectoral breakdowns.', 'Annual Budget', 'City Budget Office', 2026, 'published'),
('Invitation to Bid: Boulevard Lighting Upgrade', 'Public bidding for solar-powered LED lighting along the boulevard, ABC ₱18.5M.', 'Bids & Projects', 'Bids and Awards Committee', 2026, 'published'),
('Q1 2026 Financial Report', 'Quarterly statement of receipts, expenditures, and fund balances.', 'Financial Reports', 'City Accountant''s Office', 2026, 'published'),
('20% Development Fund Utilization Report 2025', 'Programs and projects funded under the 20% development fund with completion status.', 'Programs & Projects', 'City Planning and Development Office', 2025, 'published'),
('Annual Investment Plan 2026', 'Priority programs, projects, and activities with funding sources for FY 2026.', 'Annual Investment Plans', 'City Planning and Development Office', 2026, 'published'),
('Business Permit Application Form', 'Unified application form for new business permits and renewals.', 'Forms', 'Business Permits and Licensing Office', 2026, 'published'),
('City Scholarship Application Form', 'Application form for the city college scholarship program.', 'Forms', 'City Scholarship Office', 2026, 'published'),
('Youth Organization Accreditation Form', 'Accreditation form for youth organizations seeking city recognition and center access.', 'Forms', 'City Youth Development Office', 2026, 'published');

-- ---------- Departments (6) ----------
insert into public.departments (name, head_name, description, location, phone, email, sort_order) values
('City Mayor''s Office', 'Hon. Maria Elena R. Castillo', 'Executive direction and supervision over all city government operations and programs.', '2/F City Hall Main Building', '(043) 723-2311', 'mayor@batangascity.gov.ph', 1),
('City Youth Development Office', 'Mr. Paolo V. Hernandez', 'Youth programs, SK coordination, scholarships liaison, and the Youth Innovation Center.', 'Youth Innovation Center, P. Burgos St.', '(043) 723-4455', 'youth@batangascity.gov.ph', 2),
('City Health Office', 'Dr. Anna Katrina M. Reyes', 'Public health services, barangay health stations, and immunization programs.', 'City Health Complex, Brgy. Kumintang Ibaba', '(043) 723-2870', 'health@batangascity.gov.ph', 3),
('City Environment and Natural Resources Office (CENRO)', 'Engr. Jose Miguel T. Aquino', 'Environmental protection, waste management, and Batangas Bay rehabilitation programs.', 'G/F City Hall Annex', '(043) 723-1994', 'cenro@batangascity.gov.ph', 4),
('City Disaster Risk Reduction and Management Office (CDRRMO)', 'Mr. Ramon C. de la Peña', 'Disaster preparedness, emergency response, and the city operations center.', 'CDRRMO Operations Center, Brgy. Bolbok', '(043) 980-1911', 'cdrrmo@batangascity.gov.ph', 5),
('City Social Welfare and Development Office', 'Ms. Lourdes P. Magbanua', 'Social protection programs, assistance to families, and community-based services.', 'G/F City Hall Main Building', '(043) 723-2622', 'cswdo@batangascity.gov.ph', 6);

-- ---------- Services (grouped by office) ----------
insert into public.services (title, summary, steps, department_id, fee, processing_time, sort_order)
select * from (values
  ('Apply for the City College Scholarship',
   'Financial assistance for college students residing in Batangas City.',
   array['Attend the application orientation (see Youth Hub events)','Prepare your report card, barangay residency certificate, and one valid ID','Fill out the City Scholarship Application Form (downloadable below or from Documents & Forms)','Submit documents to the City Scholarship Office, 2/F City Hall','Wait for the SMS/email notification of results within 20 working days'],
   (select id from public.departments where name = 'City Youth Development Office'), 'Free', '20 working days', 1),
  ('Accredit a Youth Organization',
   'Get city recognition for your youth org to access grants and free venue use.',
   array['Download and complete the Youth Organization Accreditation Form','Attach your constitution & by-laws and list of at least 15 members','Submit to the City Youth Development Office','Attend the short validation interview','Receive your certificate of accreditation'],
   (select id from public.departments where name = 'City Youth Development Office'), 'Free', '10 working days', 2),
  ('Apply for / Renew a Business Permit',
   'One-stop processing for new business permits and annual renewals.',
   array['Secure a barangay business clearance from your barangay hall','Fill out the unified Business Permit Application Form','Submit at the One-Stop Shop, City Hall lobby','Pay the assessed fees at the City Treasurer''s window','Claim your permit and plate within 3 working days'],
   (select id from public.departments where name = 'City Mayor''s Office'), 'Varies by business size', '3 working days', 3),
  ('Request a Medical / Health Certificate',
   'Health certificates for employment, school, or food-handling requirements.',
   array['Visit the City Health Office with one valid ID','Undergo the required screening (fasting may be required for some tests)','Pay the certificate fee at the cashier','Claim your certificate — same day for standard requests'],
   (select id from public.departments where name = 'City Health Office'), '₱100–₱300', 'Same day', 4),
  ('Report an Environmental Violation',
   'Report illegal dumping, open burning, or coastal violations to CENRO.',
   array['Take photos/videos and note the exact location','Call the CENRO hotline or send a report through the Contact page','Provide your contact details for follow-up (reports can be anonymous)','CENRO inspects within 48 hours and issues findings'],
   (select id from public.departments where name = 'City Environment and Natural Resources Office (CENRO)'), 'Free', '48-hour inspection', 5),
  ('Request Disaster Assistance / Emergency Response',
   'For emergencies call 911 or the CDRRMO hotline; for assistance requests follow these steps.',
   array['For life-threatening emergencies, call 911 or (043) 980-1911 immediately','For post-disaster assistance, secure a barangay certification of damage','Submit the certification with a valid ID to CSWDO, G/F City Hall','Assessment team validates within 3 days and releases assistance per guidelines'],
   (select id from public.departments where name = 'City Disaster Risk Reduction and Management Office (CDRRMO)'), 'Free', '3 working days (assistance)', 6)
) as v(title, summary, steps, department_id, fee, processing_time, sort_order);

-- ---------- Officials (8; placeholder names, initials avatars rendered by UI) ----------
insert into public.officials (name, position, grouping, sort_order) values
('Hon. Maria Elena R. Castillo', 'City Mayor', 'City Officials', 1),
('Hon. Antonio G. Buenaventura', 'City Vice Mayor', 'City Officials', 2),
('Hon. Carlos D. Mercado', 'Councilor, Committee on Youth & Sports', 'Sangguniang Panlungsod', 3),
('Hon. Teresita L. Villanueva', 'Councilor, Committee on Education', 'Sangguniang Panlungsod', 4),
('Hon. Federico M. Santos', 'Councilor, Committee on Environment', 'Sangguniang Panlungsod', 5),
('Hon. Rosario B. Ilagan', 'Councilor, Committee on Health', 'Sangguniang Panlungsod', 6),
('Hon. Miguel A. Perez', 'ABC President', 'Sangguniang Panlungsod', 7),
('Hon. Kristine Joy S. Ramos', 'SK Federation President', 'SK Federation', 8);

-- ---------- Emergency hotlines ----------
insert into public.hotlines (name, numbers, category, sort_order) values
('National Emergency Hotline', array['911'], 'Emergency', 1),
('CDRRMO Operations Center', array['(043) 980-1911', '0917-123-4567'], 'Emergency', 2),
('Batangas City Police Station', array['(043) 723-2130', '0998-598-5972'], 'Emergency', 3),
('Bureau of Fire Protection — Batangas City', array['(043) 723-2412', '0917-543-2109'], 'Emergency', 4),
('Batangas Medical Center (ER)', array['(043) 740-8307'], 'Health', 5),
('City Health Office', array['(043) 723-2870'], 'Health', 6),
('CENRO Environmental Hotline', array['(043) 723-1994'], 'City Services', 7),
('City Hall Trunkline', array['(043) 723-2311'], 'City Services', 8);

-- ---------- Proposals open for public comment (2) ----------
insert into public.proposals (slug, title, summary, body, proposal_status, comments_close_at, status) values
('proposed-youth-night-market-ordinance', 'Proposed Ordinance: Batangueño Youth Night Market',
 'A monthly night market along the boulevard reserving 60% of stalls for youth-led businesses and student entrepreneurs.',
 '<p>The proposed ordinance establishes a monthly <strong>Youth Night Market</strong> along the Batangas City Boulevard, reserving at least 60% of stalls for entrepreneurs aged 18–30 and student business organizations.</p><p>Key provisions:</p><ul><li>Subsidized stall fees for first-time young entrepreneurs (₱150/night for the first 6 months)</li><li>A simplified one-page permit processed by the Youth Development Office</li><li>Live performance slots for young artists, curated monthly</li><li>Zero-waste requirements: no single-use plastics, mandatory waste segregation</li></ul><p>The Committee on Youth &amp; Sports invites comments, especially from student entrepreneurs and boulevard-area residents.</p>',
 'open', now() + interval '30 days', 'published'),
('proposed-bike-lane-network-phase1', 'Proposed Ordinance: Protected Bike Lane Network (Phase 1)',
 'A 12-km protected bike lane network connecting major schools, the city hall, and the boulevard.',
 '<p>This proposal creates a <strong>12-kilometer protected bicycle lane network</strong> connecting major schools and universities, City Hall, the public market, and the boulevard.</p><p>Key provisions:</p><ul><li>Physically separated lanes on P. Burgos, Rizal Avenue, and the diversion road</li><li>Secure bike parking at schools and government buildings</li><li>A "Bike to School" incentive program with partner shops</li><li>Phased construction over 18 months with quarterly public progress reports</li></ul><p>Students who bike or want to bike to school are especially encouraged to comment on route coverage.</p>',
 'open', now() + interval '45 days', 'published');
