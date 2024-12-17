DELETE FROM event;

BEGIN TRANSACTION;

-- Day 0 (Wednesday, Jan 1)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Arrivals', NULL, NULL, 7.5, 15.0, 0, 'var(--calendar-background-white)'),
('Registration', 'Registration at Delta Hotel', 'Delta Hotel', 15.0, 17.0, 0, 'var(--calendar-background-2)'),
('Transportation Delta Hotel -> UNB (Head Hall)', NULL, NULL, 17.0, 18.0, 0, 'var(--calendar-background-white)'),
('CELC 101', 'CELC 2025 Organizing Committee', NULL, 18.0, 18.5, 0, 'var(--calendar-background-white)'),
('Supper', NULL, 'Head Hall', 18.5, 19.5, 0, 'var(--calendar-background-2)'),
('CFES 101 Kahoot', 'Ambassadors and CFES Officers', NULL, 19.5, 20.0, 0, 'var(--calendar-background-white)'),
('Opening Mixer & Amazing Race', NULL, 'Head Hall', 20, 22.0, 0, 'var(--calendar-background-3)'),
('Transportation Head Hall -> Delta Hotel', NULL, NULL, 22.0, 23, 0, 'var(--calendar-background-white)');

-- Day 1 (Thursday, Jan 2)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Breakfast', NULL, 'Grand Ballroom ABC', 7.5, 8.5, 1, 'var(--calendar-background-3)'),
('Opening Ceremonies', NULL, 'Grand Ballroom ABC', 8.5, 10.0, 1, 'var(--calendar-background-white)'),
-- ('Break', NULL, NULL, 10.0, 10.25, 1, 'var(--calendar-background-grey)'),
('Equity, Diversity, & Inclusion Training', NULL, 'Grand Ballroom ABC', 10.25, 11.25, 1, 'var(--calendar-background-white)'),
-- ('Break', NULL, NULL, 11.25, 11.5, 1, 'var(--calendar-background-grey)'),
('Welcome & Officer Updates', 'CFES Officer Team', 'Governor''s Ballroom AB', 11.5, 12.5, 1, 'var(--calendar-background-governance)'),
('X', null, 'Grand Ballroom D', 11.5, 12.5, 1, 'var(--calendar-background-engineer)'),
('Mental Health Skills: Unlocking your Highest Performance', null, 'Victoria', 11.5, 12.5, 1, 'var(--calendar-background-leader)'),
('Sustainable Project Management: A Question of Balance', null, 'Grand Ballroom E', 11.5, 12.5, 1, 'var(--calendar-background-professional)'),
('Lunch', NULL, NULL, 12.5, 13.5, 1, 'var(--calendar-background-3)'),
('Industrial Tour #1', NULL, 'Grand Ballroom D', 13.5, 17, 1, 'var(--calendar-background-engineer)'),
('Dr. Juan A. Carretero', NULL, NULL, 17.25, 18.25, 1, 'var(--calendar-background-engineer)'),
('Strategic Planning', 'Kalena McCloskey', 'Governor''s Ballroom AB', 13.5, 14, 1, 'var(--calendar-background-governance)'),
('BoD/Nat Exec Motion Proposal', NULL, NULL, 14, 14.5, 1, 'var(--calendar-background-governance)'),
('CELC Panel #1', NULL, NULL, 13.5, 14.5, 1, 'var(--calendar-background-professional)'),
('Engineering Social and Environmental Justice', NULL, NULL, 13.5, 14.5, 1, 'var(--calendar-background-leader)'),
-- ('Break', NULL, NULL, 14.5, 14.75, 1, 'var(--calendar-background-grey)'),
('Stance Overview Session #1', 'Kalena McCloskey', NULL, 14.75, 15.75, 1, 'var(--calendar-background-governance)'),
('Engineering Leadership: Driving Change Through Entrepreneurship', 'Kalena McCloskey', NULL, 14.75, 15.75, 1, 'var(--calendar-background-leader)'),
('Developing Yourself as an Engineering Student', 'Kalena McCloskey', NULL, 14.75, 15.75, 1, 'var(--calendar-background-professional)'),
-- ('Break', NULL, NULL, 15.75, 16, 1, 'var(--calendar-background-grey)'),
('Case Competition #1', NULL, NULL, 16, 18.25, 1, 'var(--calendar-background-leader)'),
('Budget Updates & Proposal', 'Luke Schuurman', NULL, 16, 17, 1, 'var(--calendar-background-governance)'),
('Unleashing Your Leadership Potential: Ten Essential Lessons for Personal Excellence', NULL, NULL, 16, 17, 1, 'var(--calendar-background-professional)'),
('Services Proposals Session', 'Houda El Hajjaoui', NULL, 17.25, 18.25, 1, 'var(--calendar-background-governance)'),
('Design with Care: Define First, Then Solve', NULL, NULL, 17.25, 18.25, 1, 'var(--calendar-background-professional)'),
('Off-Time', NULL, NULL, 18.25, 18.75, 1, 'var(--calendar-background-white)'),
('Restaurant Crawl & Karaoke', NULL, NULL, 18.75, 24.0, 1, 'var(--calendar-background-3)');

-- Day 2 (Friday, Jan 3)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Transportation to UNB', NULL, NULL, 7.5, 8.5, 2, 'var(--calendar-background-white)'),
('Breakfast (UNB)', NULL, NULL, 8.5, 9.5, 2, 'var(--calendar-background-3)'),
('Regional Meetings', NULL, NULL, 9.5, 10, 2, 'var(--calendar-background-white)'),
('CELC Career Fair', '(University of New Brunswick Student Union Building)', NULL, 10, 11.5, 2, 'var(--calendar-background-white)'),
('Drop in Motion Writing', 'Kells Moore and Jayden MacKenzie', NULL, 11.5, 12.5, 2, 'var(--calendar-background-governance)'),
('Drop in Stance/National Survey Writing', 'Kalena McCloskey and Lauren Smith', NULL, 11.5, 12.5, 2, 'var(--calendar-background-governance)'),
('Leading Successful Projects', 'Darien Edison', NULL, 11.5, 12.5, 2, 'var(--calendar-background-leader)'),
('Curiosity as Your Compass: Discovering Unexpected Paths to Fulfilment in Engineering', 'Darien Edison', NULL, 11.5, 12.5, 2, 'var(--calendar-background-engineer)'),
('CELC Tour #2', 'Head Hall Design Commons', NULL, 11.5, 12.5, 2, 'var(--calendar-background-professional)'),
('Lunch (University of New Brunswick)', NULL, NULL, 12.5, 13.5, 2, 'var(--calendar-background-3)'),
('Drop in Motion Writing', 'Kells Moore and Jayden MacKenzie', NULL, 13.5, 14.5, 2, 'var(--calendar-background-governance)'),
('Drop in Stance/National Survey Writing', 'Kalena McCloskey and Lauren Smith', NULL, 13.5, 14.5, 2, 'var(--calendar-background-governance)'),
('A Career in Pictures', 'Patti Breaker', NULL, 13.5, 14.5, 2, 'var(--calendar-background-engineer)'),
('Industrial Tour #3', 'UNB Central Heating Plant Tour', NULL, 13.5, 15.75, 2, 'var(--calendar-background-leader)'),
('Becoming a Trusted Advisor', 'Tanya Chapman', NULL, 13.5, 14.5, 2, 'var(--calendar-background-professional)'),
('Drop in Motion Writing', 'Kells Moore and Jayden MacKenzie', NULL, 14.75, 15.75, 2, 'var(--calendar-background-governance)'),
('Drop in Stance/National Survey Writing', 'Kalena McCloskey and Lauren Smith', NULL, 14.75, 15.75, 2, 'var(--calendar-background-governance)'),
('A Curiosity Driven Career', 'Ande Mosher', NULL, 14.75, 15.75, 2, 'var(--calendar-background-engineer)'),
('Lean & Six Sigma Methodologies', 'Rick Wasson', NULL, 14.75, 15.75, 2, 'var(--calendar-background-professional)'),
('Case Competition #2', '(Dineen Auditorium - Head Hall C13)', NULL, 15.75, 18, 2, 'var(--calendar-background-grey)'),
('Dinner', NULL, NULL, 18, 18.75, 2, 'var(--calendar-background-white)'),
('Transportation to Evening Event', NULL, NULL, 18.75, 19.5, 2, 'var(--calendar-background-white)'),
('Evening Event - Live Music', NULL, NULL, 19.5, 24, 2, 'var(--calendar-background-3)');

-- Day 3 (Saturday, Jan 4)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Breakfast', NULL, NULL, 7.5, 8.5, 3, 'var(--calendar-background-3)'),
('Regional Meetings', NULL, NULL, 8.5, 9.0, 3, 'var(--calendar-background-white)'),
('National Survey and Stance Roundtables', 'Kalena McCloskey', 'Governance (Governor’s Ballroom AB)', 9.0, 10.0, 3, 'var(--calendar-background-governance)'),
('A Career In Quality Engineering and Regulatory Work', 'Jake Stienburg & Mike Gray', 'The Engineer (Grand Ballroom D)', 9.0, 10.0, 3, 'var(--calendar-background-engineer)'),
('EDBA In Action - Roundtable Discussions', 'Camilla Drost', 'The Leader (Victoria)', 9.0, 10.0, 3, 'var(--calendar-background-leader)'),
('Work Smarter, Not Harder', 'Bridget Paterson', 'The Professional (Grand Ballroom E)', 9.0, 10.0, 3, 'var(--calendar-background-professional)'),
-- ('Break', NULL, NULL, 10.0, 10.25, 3, 'var(--calendar-background-grey)'),
('Partner Updates (EDC, CEAB, BEST, etc.)', 'Jamie Grasley', 'Governance (Governor’s Ballroom AB)', 10.25, 11.25, 3, 'var(--calendar-background-governance)'),
('Insights on the Future of Nuclear Energy in New Brunswick', 'Rachel Kierstead', 'The Engineer (Grand Ballroom D)', 10.25, 11.25, 3, 'var(--calendar-background-engineer)'),
('Transferring Leadership Skills to the Job Market', 'Emma Sanderson', 'The Leader (Victoria)', 10.25, 11.25, 3, 'var(--calendar-background-leader)'),
('Maria Panezi', NULL, 'The Professional (Grand Ballroom E)', 10.25, 11.25, 3, 'var(--calendar-background-professional)'),
-- ('Break', NULL, NULL, 11.25, 11.5, 3, 'var(--calendar-background-grey)'),
('Member-Led Session: Idea Generation and Roundtables', 'BoD and Nat Exec', 'Governance (Governor’s Ballroom AB)', 11.5, 12.5, 3, 'var(--calendar-background-governance)'),
('Craig Moore', NULL, 'The Engineer (Grand Ballroom D)', 11.5, 12.5, 3, 'var(--calendar-background-engineer)'),
('Managing your Peers', 'Sarah Boyd', 'The Leader (Victoria)', 11.5, 12.5, 3, 'var(--calendar-background-leader)'),
('Innovating in Industry: Beyond Ideas', 'Anna Robak', 'The Professional (Grand Ballroom E)', 11.5, 12.5, 3, 'var(--calendar-background-professional)'),
('Lunch - Nomination Period #1', NULL, NULL, 12.5, 13.5, 3, 'var(--calendar-background-3)'),
('CELC Panel #2 - Clean Energy Futures', NULL, 'Governance (Governor’s Ballroom AB)', 13.5, 14.5, 3, 'var(--calendar-background-engineer)'),
('Lead Together: Empower to Inspire Change', 'Rowan Pratt & Bridget Patterson', 'The Leader (Victoria)', 13.5, 14.5, 3, 'var(--calendar-background-leader)'),
('Awakenings - The Opportunities and Realities of Climate Change', 'Carl Duivenvoorden', 'The Professional (Grand Ballroom E)', 13.5, 14.5, 3, 'var(--calendar-background-professional)'),
-- ('Break', NULL, NULL, 14.5, 14.75, 3, 'var(--calendar-background-grey)'),
('General Assembly A', NULL, 'Governance (Governor’s Ballroom AB)', 13.5, 17.0, 3, 'var(--calendar-background-governance)'),
('Effective Project Management Techniques', 'Susan Mayo', 'The Professional (Grand Ballroom E)', 14.75, 15.75, 3, 'var(--calendar-background-professional)'),
('A Day in the Life of Different Mechanical Engineering Roles in Heavy Industry', 'Dan Fearn', 'The Engineer (Grand Ballroom D)', 14.75, 15.75, 3, 'var(--calendar-background-engineer)'),
('Case Competition #3', NULL, 'The Leader (Victoria)', 14.75, 17, 3, 'var(--calendar-background-leader)'),
('The Future of Nuclear Power', 'Ryan Brown', 'The Engineer (Grand Ballroom D)', 16.0, 17.0, 3, 'var(--calendar-background-engineer)'),
('The New Dawn of Engineering Qualifications', 'Frank Collins', 'The Professional (Grand Ballroom E)', 16.0, 17.0, 3, 'var(--calendar-background-professional)'),
('Off-Time', NULL, NULL, 17.0, 17.5, 3, 'var(--calendar-background-grey)'),
('Maritime Kitchen Party', NULL, NULL, 17.5, 24, 3, 'var(--calendar-background-3)');


-- Day 4 (Sunday, Jan 5)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Breakfast/Nomination Period #2', NULL, NULL, 7.5, 8.5, 4, 'var(--calendar-background-3)'),
('Regional Meetings', NULL, NULL, 8.5, 9.0, 4, 'var(--calendar-background-white)'),
('CFES Elections & Bids', NULL, 'Governance (Governor’s Ballroom AB)', 9.0, 12.5, 4, 'var(--calendar-background-governance)'),
('Sunrise Yoga with Jai', 'YogaNature', 'The Professional (Grand Ballroom E)', 9.0, 10.0, 4, 'var(--calendar-background-professional)'),
('EUS Patch Sewing Drop In', 'Gian Damot', 'The Professional (Grand Ballroom E)', 10, 11, 4, 'var(--calendar-background-professional)'),
('Zumba', 'REDS Recreation', 'The Professional (Grand Ballroom E)', 11, 12.0, 4, 'var(--calendar-background-professional)'),
('Off-Time', NULL, NULL, 12.0, 12.5, 4, 'var(--calendar-background-grey)'),
('Lunch', NULL, NULL, 12.5, 13.5, 4, 'var(--calendar-background-3)'),
('Regional Rumble', 'Ambassadors and Regional Groups', 'Governance (Governor’s Ballroom AB)', 13.75, 15.25, 4, 'var(--calendar-background-governance)'),
('Olga Palazhchenko', NULL, 'The Engineer (Grand Ballroom D)', 13.75, 14.75, 4, 'var(--calendar-background-engineer)'),
('CELC Panel #3', 'Student Leadership Playbook', 'The Leader (Victoria)', 13.75, 14.75, 4, 'var(--calendar-background-leader)'),
('Sponsorship 101', 'Ashlyn George & Marin MacPherson', 'The Professional (Grand Ballroom E)', 13.75, 14.75, 4, 'var(--calendar-background-professional)'),
('Building a Future for All: Universal Design in Action', 'Cassie Pitchford & Abby Cartwright', 'The Engineer (Grand Ballroom D)', 15, 16, 4, 'var(--calendar-background-engineer)'),
('Trust and Accountability in Student Leadership', 'Holly Clarke', 'The Leader (Victoria)', 15, 16, 4, 'var(--calendar-background-leader)'),
('Fundamentals of Effective Leadership: Key Strategies for Becoming a High Performing Team Player', 'Vince d’Entremont', 'The Professional (Grand Ballroom E)', 15, 16, 4, 'var(--calendar-background-professional)'),
('Membership Engagement Sessions', 'CFES National Executive', 'Governance (Governor’s Ballroom AB)', 15.5, 16.5, 4, 'var(--calendar-background-governance)'),
('Accountability Session', 'Ambassadors and Regional Groups', 'Governance (Governor’s Ballroom AB)', 16.75, 17.75, 4, 'var(--calendar-background-governance)'),
('UNB Student Society of Mechanical Engineers', 'The Design and Construction of a Coaster Derby Car', 'The Engineer (Grand Ballroom D)', 16.25, 17.25, 4, 'var(--calendar-background-engineer)'),
('ACEC Talk Show', NULL, 'The Leader (Victoria)', 16.25, 17.25, 4, 'var(--calendar-background-professional)'),
('Preparations for Evening Event', NULL, NULL, 17.75, 18.5, 4, 'var(--calendar-background-grey)'),
('CELC Banquet', NULL, NULL, 18.5, 24, 4, 'var(--calendar-background-3)');

-- Day 5 (Monday, Jan 6)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Breakfast', NULL, NULL, 7.5, 8.5, 5, 'var(--calendar-background-3)'),  -- Corrected time
('Regional Meetings', NULL, NULL, 8.5, 9, 5, 'var(--calendar-background-white)'),
('Engineers Canada - 30 by 30', NULL, NULL, 9, 10.25, 5, 'var(--calendar-background-grey)'), 
('Round Tables', NULL, NULL, 10.25, 11.25, 5, 'var(--calendar-background-grey)'), 
('General Assembly B', NULL, NULL, 9, 12.5, 5, 'var(--calendar-background-governance)'),  -- Corrected time
('Power of Indigenous Partnerships in Energy Transition Projects', 'Kevin Woods', 'Grand Ballroom D', 11.5, 12.5, 5, 'var(--calendar-background-engineer)'),  -- Overlaps
('A Masterclass in Conference Planning', 'Lauren Dysart & Colby Arsenault', 'Victoria', 11.5, 12.5, 5, 'var(--calendar-background-leader)'),  -- Overlaps
('Ordinary to Extraordinary: Key attributes that help you succeed in an evolving workplace', 'Passionate NCube', 'Grand Ballroom E', 11.5, 12.5, 5, 'var(--calendar-background-professional)'), -- Overlaps
('Lunch - Engineers Canada Accreditation Lunch and Learn', NULL, NULL, 12.5, 13.5, 5, 'var(--calendar-background-3)'),
('Developments in Advanced Corrosion Monitoring Technologies', 'William Cook', NULL, 13.5, 14.5, 5, 'var(--calendar-background-engineer)'),
('Community Focused Leadership', 'Tyler Patles', NULL, 13.5, 14.5, 5, 'var(--calendar-background-leader)'),
('Accessible Event Planning', 'Sophie Petruskina', NULL, 13.5, 14.5, 5, 'var(--calendar-background-professional)'),
('General Assembly C', NULL, NULL, 13.5, 17, 5, 'var(--calendar-background-governance)'),
('Case Competition #4', 'presented by J. D. Irving Limited', NULL, 14.75, 17, 5, 'var(--calendar-background-engineer)'), -- Overlaps
('Managing Effective Operations', 'Sarah Barnes', NULL, 14.75, 15.75, 5, 'var(--calendar-background-leader)'), -- Overlaps
('Leading With Humanity In Our New World of Work', 'Pierre Battah', NULL, 14.75, 15.75, 5, 'var(--calendar-background-professional)'), -- Overlaps
('Leading Strategic Operations', 'Todd Kelly', NULL, 16, 17, 5, 'var(--calendar-background-leader)'),
('Risk Based Decision Making', 'Nancy Armstrong', NULL, 16, 17, 5, 'var(--calendar-background-professional)'),
('Transportation to Evening Event', NULL, NULL, 17, 18.25, 5, 'var(--calendar-background-white)'), -- Corrected time
('Charity Auction & Closing Ceremony', NULL, NULL, 18.25, 24, 5, 'var(--calendar-background-3)'); -- Corrected time

-- Day 6 (Tuesday, Jan 7)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Departures', NULL, NULL, 7.5, 24, 6, 'var(--calendar-background-2)');

-- Commit the transaction
COMMIT;