-- CSP DEMO SEED DATA
-- Fictional sample data for testing/demo purposes.
-- Do not present these records as real beneficiaries, donors, transactions,
-- or verified field activities.
-- Run after both migrations: supabase db reset

-- ─────────────────────────────────────────────────────────────
-- UNITS: National → State → City/District → Assembly → Ward/Village
-- ─────────────────────────────────────────────────────────────
insert into units (id, parent_id, level, name, slug, status, description) values
  ('00000000-0000-0000-0000-000000000001', null, 'national', 'National', 'national', 'chapter', 'National coordination layer for civic initiatives.'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'state', 'Telangana', 'telangana', 'chapter', 'State-level civic coordination and public reporting.'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'city_district', 'Hyderabad', 'hyderabad', 'working_group', 'City working group for neighbourhood-focused initiatives.'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'assembly', 'Serilingampally', 'serilingampally', 'working_group', 'Assembly-level working group covering local civic issues.'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'assembly', 'LB Nagar', 'lb-nagar', 'working_group', 'Assembly-level working group focused on neighbourhood services.'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'city_district', 'Warangal', 'warangal', 'working_group', 'City working group for civic and environmental initiatives.'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'state', 'Karnataka', 'karnataka', 'working_group', 'State working group for pilot community initiatives.'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000007', 'city_district', 'Bengaluru', 'bengaluru', 'working_group', 'City working group for neighbourhood projects.');

-- ─────────────────────────────────────────────────────────────
-- INITIATIVES
-- ─────────────────────────────────────────────────────────────
insert into initiatives (id, unit_id, type, justice_pillar, title, slug, summary, description, goal_amount, start_date, end_date, status, is_published) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'campaign', 'Education Justice', 'School Supplies Drive', 'school-supplies-drive-hyderabad',
   'Providing notebooks, school bags and essential learning materials to 200 students before the new term.',
   'A fictional ward-level demo campaign focused on practical school support. The sample program is designed to test progress tracking, updates, reporting and the donation flow.',
   200000, '2026-07-01', '2026-10-15', 'active', true),

  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'project', 'Environmental Justice', 'Lake Restoration — Phase 1', 'lake-restoration-phase-1',
   'Clearing debris, testing water quality and restoring access around a neighbourhood lake.',
   'A fictional environmental project for testing multi-stage project pages, transparency reports and progress updates.',
   500000, '2026-06-15', '2026-12-20', 'active', true),

  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'campaign', 'Health Justice', 'Community Health Camp Series', 'community-health-camp-series-serilingampally',
   'A series of fictional weekend health camps with screening, awareness and referral support.',
   'Demo campaign data representing a recurring community health outreach program. Useful for testing active campaigns with moderate fundraising targets.',
   350000, '2026-08-05', '2026-11-30', 'active', true),

  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'project', 'Public Services Justice', 'Neighbourhood Water Access Upgrade', 'neighbourhood-water-access-upgrade-lbnagar',
   'Mapping water access points and piloting repairs in underserved lanes.',
   'Fictional civic-service project data for testing project status, unit hierarchy and public reporting.',
   275000, '2026-05-20', '2026-09-30', 'active', true),

  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'campaign', 'Environmental Justice', 'Urban Tree Recovery Drive', 'urban-tree-recovery-drive-warangal',
   'Replacing damaged roadside trees and supporting first-year maintenance.',
   'Fictional campaign data for a city-level urban greening initiative.',
   180000, '2026-08-20', '2026-12-15', 'planned', true),

  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000008', 'campaign', 'Youth Justice', 'Youth Digital Skills Lab', 'youth-digital-skills-lab-bengaluru',
   'Equipping a fictional community lab with refurbished devices and beginner digital-skills workshops.',
   'Demo campaign for testing a larger donor goal and long-form initiative descriptions.',
   650000, '2026-07-15', '2027-01-31', 'active', true),

  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', 'project', 'Worker Justice', 'Street Vendor Support Pilot', 'street-vendor-support-pilot-karnataka',
   'A fictional pilot providing information, documentation support and market-access workshops.',
   'Demo data for a state-level initiative with no donation goal, allowing the follow-only experience to be tested.',
   null, '2026-08-01', null, 'active', true),

  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'project', 'Civic Participation', 'National Civic Data Fellowship', 'national-civic-data-fellowship',
   'A fictional national learning program for volunteers working with public-interest datasets.',
   'Demo national initiative used to test the top-level unit hierarchy and initiative discovery pages.',
   null, '2026-09-01', '2027-03-31', 'planned', true),

  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', 'campaign', 'Food Justice', 'Neighbourhood Community Kitchen', 'neighbourhood-community-kitchen-hyderabad',
   'Supporting a fictional community kitchen with staple-food procurement and volunteer logistics.',
   'Demo fundraising campaign designed to make the home page and initiative directory feel active and varied.',
   425000, '2026-09-03', '2026-12-31', 'active', true),

  ('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'campaign', 'Education Justice', 'Women Return-to-Learning Fund', 'women-return-to-learning-fund-hyderabad',
   'A fictional scholarship-style fund for adult learners returning to basic digital and vocational education.',
   'Demo campaign data for testing a second education-focused card and filtering by justice pillar.',
   300000, '2026-08-12', '2026-11-30', 'completed', true);

-- ─────────────────────────────────────────────────────────────
-- UPDATE FEED
-- ─────────────────────────────────────────────────────────────
insert into initiative_updates (id, initiative_id, title, body, is_published, created_at) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'First 50 kits distributed', 'The first batch of fictional demo supply kits has been marked as distributed. This update is included to test the initiative timeline.', true, '2026-08-10T09:30:00Z'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Second procurement batch ordered', 'A second demo procurement batch has been recorded, taking the sample campaign closer to its target.', true, '2026-08-28T11:15:00Z'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Water testing phase started', 'The sample project has moved into water-quality testing after the initial site-clearance phase.', true, '2026-08-18T08:45:00Z'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Volunteer cleanup weekend completed', 'A fictional volunteer event has been logged to exercise recurring project updates.', true, '2026-09-04T16:20:00Z'),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'Camp 01 scheduled', 'The first fictional community health camp has been scheduled for the current demo cycle.', true, '2026-08-22T10:00:00Z'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', 'Access-point mapping completed', 'The sample mapping exercise has been completed and the next phase is focused on prioritising repairs.', true, '2026-08-30T13:10:00Z'),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000006', 'Lab equipment shortlist approved', 'The fictional demo team has shortlisted refurbished devices for the learning lab.', true, '2026-09-07T07:50:00Z'),
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000009', 'Volunteer kitchen rota published', 'A sample volunteer rota is now published for the first month of the fictional community kitchen pilot.', true, '2026-09-09T12:25:00Z'),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000010', 'Program completed', 'The fictional demo program has been marked completed so the completed-status filter can be tested.', true, '2026-09-10T14:00:00Z');

-- ─────────────────────────────────────────────────────────────
-- FINANCIAL REPORTS
-- ─────────────────────────────────────────────────────────────
insert into financial_reports (id, unit_id, period_label, period_start, period_end, total_income, total_expenditure, summary, is_published) values
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Q1 2026', '2026-01-01', '2026-03-31', 850000, 620000, 'Fictional quarterly demo report covering sample donations, grant-style income and program logistics.', true),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Q2 2026', '2026-04-01', '2026-06-30', 1260000, 910000, 'Fictional report for testing year-to-date transparency reporting at state level.', true),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Q2 2026', '2026-04-01', '2026-06-30', 610000, 455000, 'Fictional Hyderabad unit report covering education, environment and community-support activity.', true),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Q3 2026 — to date', '2026-07-01', '2026-09-14', 735000, 498000, 'Fictional current-quarter report included to make the dashboard and transparency page feel current.', true),
  ('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'Q3 2026 — to date', '2026-07-01', '2026-09-14', 285000, 192000, 'Fictional Warangal unit report used to test multiple city-level transparency entries.', true),
  ('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000008', 'Q3 2026 — to date', '2026-07-01', '2026-09-14', 420000, 301000, 'Fictional Bengaluru unit report used for cross-state browsing and reporting tests.', true);
