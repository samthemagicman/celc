DELETE FROM event;

-- Day 0 (Wednesday, Jan 1)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor, eventType) VALUES
('Arrivals', NULL, NULL, 7.5, 15.0, 0, '#74B3FB', 'default'),
('Registration', NULL, 'Delta Hotel', 15.0, 17.0, 0, '#74B3FB', 'default'),
('Transportation to UNB', NULL, NULL, 17.0, 18.0, 0, '#FFFFFF', 'default'),
('Head Delegate Meeting', NULL, NULL, 18.0, 18.75, 0, '#FFFFFF', 'default'),
('Dinner', NULL, NULL, 18.75, 19.5, 0, '#74B3FB', 'default'),
('Welcome Sessions', NULL, NULL, 19.5, 20.25, 0, '#FFFFFF', 'default'),
('Evening Event', NULL, NULL, 20.25, 22.0, 0, '#C3326C', 'default'),
('Transportation to Hotel', NULL, NULL, 22.0, 23.0, 0, '#FFFFFF', 'default');

-- Day 1 (Thursday, Jan 2)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Breakfast', NULL, NULL, 7.5, 8.5, 1, '#649964'),
('Opening Ceremonies', NULL, NULL, 8.5, 10.0, 1, '#ffae26'),
('Break', NULL, NULL, 10.0, 10.25, 1, '#4f4f4f'),
('Equity, Diversity, & Inclusion Training', NULL, NULL, 10.25, 11.25, 1, '#bd68bd'),
('Break', NULL, NULL, 11.25, 11.5, 1, '#4f4f4f'),
('Governance Session', NULL, NULL, 11.5, 12.5, 1, '#536b8f'),
('Session 1', NULL, NULL, 11.5, 12.5, 1, '#39a2ff'),
('Session 2', NULL, NULL, 11.5, 12.5, 1, '#39a2ff'),
('Session 3', NULL, NULL, 11.5, 12.5, 1, '#39a2ff'),
('Lunch', NULL, NULL, 12.5, 13.5, 1, '#649964'),
('Governance Session', NULL, NULL, 13.5, 14.5, 1, '#536b8f'),
('Session 4', NULL, NULL, 13.5, 14.5, 1, '#39a2ff'),
('Session 5', NULL, NULL, 13.5, 14.5, 1, '#39a2ff'),
('Session 6', NULL, NULL, 13.5, 14.5, 1, '#39a2ff'),
('Break', NULL, NULL, 14.5, 14.75, 1, '#4f4f4f'),
('Governance Session', NULL, NULL, 14.75, 15.75, 1, '#536b8f'),
('Session 7', NULL, NULL, 14.75, 15.75, 1, '#39a2ff'),
('Session 8', NULL, NULL, 14.75, 15.75, 1, '#39a2ff'),
('Session 9', NULL, NULL, 14.75, 15.75, 1, '#39a2ff'),
('Break', NULL, NULL, 15.75, 16.0, 1, '#4f4f4f'),
('Governance Session', NULL, NULL, 16.0, 17.0, 1, '#536b8f'),
('Case Competition 1', NULL, NULL, 16.0, 17.0, 1, '#d93a3a'),
('Session 10', NULL, NULL, 16.0, 17.0, 1, '#39a2ff'),
('Session 11', NULL, NULL, 16.0, 17.0, 1, '#39a2ff'),
('Break', NULL, NULL, 17.0, 17.25, 1, '#4f4f4f'),
('Governance Session', NULL, NULL, 17.25, 18.0, 1, '#536b8f'),
('Session 12', NULL, NULL, 17.25, 18.0, 1, '#39a2ff'),
('Session 13', NULL, NULL, 17.25, 18.0, 1, '#39a2ff'),
('Off-Time', NULL, NULL, 18.0, 18.75, 1, '#ff4747'),
('Evening Event', NULL, NULL, 18.75, 24.0, 1, '#ffb443');

-- Day 2 (Friday, Jan 3)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Breakfast', NULL, NULL, 7.5, 8.5, 2, '#649964'),
('Regional Meetings', NULL, NULL, 8.5, 9.0, 2, '#536b8f'),
('Transportation to University of New Brunswick', NULL, 'University of New Brunswick', 9.0, 10.0, 2, '#4f4f4f'),
('CELC Career Fair', 'Career Fair at University of New Brunswick', 'University of New Brunswick', 10.0, 11.5, 2, '#ffae26'),
('Free Session', 'Any Stream', NULL, 11.5, 12.5, 2, '#39a2ff'),
('Session 30', NULL, NULL, 11.5, 12.5, 2, '#39a2ff'),
('Session 31', NULL, NULL, 11.5, 12.5, 2, '#39a2ff'),
('Session 32', NULL, NULL, 11.5, 12.5, 2, '#39a2ff'),
('Lunch', 'Lunch at University of New Brunswick', 'University of New Brunswick', 12.5, 13.5, 2, '#649964'),
('Free Session', 'Any Stream', NULL, 13.5, 14.5, 2, '#39a2ff'),
('Session 33', NULL, NULL, 13.5, 14.5, 2, '#39a2ff'),
('Session 34', NULL, NULL, 13.5, 14.5, 2, '#39a2ff'),
('Session 35', NULL, NULL, 13.5, 14.5, 2, '#39a2ff'),
('Break', NULL, NULL, 14.5, 14.75, 2, '#4f4f4f'),
('Free Session', 'Any Stream', NULL, 14.75, 15.75, 2, '#39a2ff'),
('Session 36', NULL, NULL, 14.75, 15.75, 2, '#39a2ff'),
('Session 37', NULL, NULL, 14.75, 15.75, 2, '#39a2ff'),
('Session 38', NULL, NULL, 14.75, 15.75, 2, '#39a2ff'),
('Case Competition 3', NULL, 'Engineering Building', 15.75, 17.5, 2, '#d93a3a'),
('Transportation to Evening Event', NULL, NULL, 17.5, 18.0, 2, '#4f4f4f'),
('Dinner', NULL, NULL, 18.0, 18.5, 2, '#649964'),
('Transportation to Evening Event', NULL, NULL, 18.5, 19.0, 2, '#4f4f4f'),
('Evening Event', NULL, NULL, 19.0, 22.0, 2, '#ffb443');

-- Day 3 (Saturday, Jan 4)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Breakfast', NULL, NULL, 7.5, 8.5, 3, '#649964'),
('Regional Meetings', NULL, NULL, 8.5, 9.0, 3, '#536b8f'),
('Governance Session', NULL, NULL, 9.0, 10.0, 3, '#536b8f'),
('Session 14', NULL, NULL, 9.0, 10.0, 3, '#39a2ff'),
('Session 15', NULL, NULL, 9.0, 10.0, 3, '#39a2ff'),
('Session 16', NULL, NULL, 9.0, 10.0, 3, '#39a2ff'),
('Break', NULL, NULL, 10.0, 10.25, 3, '#4f4f4f'),
('Governance Session', NULL, NULL, 10.25, 11.25, 3, '#536b8f'),
('Session 17', NULL, NULL, 10.25, 11.25, 3, '#39a2ff'),
('Session 18', NULL, NULL, 10.25, 11.25, 3, '#39a2ff'),
('Session 19', NULL, NULL, 10.25, 11.25, 3, '#39a2ff'),
('Break', NULL, NULL, 11.25, 11.5, 3, '#4f4f4f'),
('Governance Session', NULL, NULL, 11.5, 12.5, 3, '#536b8f'),
('Session 20', NULL, NULL, 11.5, 12.5, 3, '#39a2ff'),
('Session 21', NULL, NULL, 11.5, 12.5, 3, '#39a2ff'),
('Session 22', NULL, NULL, 11.5, 12.5, 3, '#39a2ff'),
('Lunch', NULL, NULL, 12.5, 13.5, 3, '#649964'),
('General Assembly A', NULL, NULL, 13.5, 14.0, 3, '#ffae26'),
('Session 23', NULL, NULL, 13.5, 14.0, 3, '#39a2ff'),
('Session 24', NULL, NULL, 13.5, 14.0, 3, '#39a2ff'),
('Session 25', NULL, NULL, 13.5, 14.0, 3, '#39a2ff'),
('Break', NULL, NULL, 14.0, 14.25, 3, '#4f4f4f'),
('Regional Rumble', NULL, NULL, 14.25, 15.25, 3, '#ffae26'),
('Session 39', NULL, NULL, 14.25, 15.25, 3, '#39a2ff'),
('Session 40', NULL, NULL, 14.25, 15.25, 3, '#39a2ff'),
('Session 41', NULL, NULL, 14.25, 15.25, 3, '#39a2ff'),
('Break', NULL, NULL, 15.25, 15.5, 3, '#4f4f4f'),
('Session 26', NULL, NULL, 15.5, 16.5, 3, '#39a2ff'),
('Case Competition 2', NULL, NULL, 15.5, 16.5, 3, '#d93a3a'),
('Session 27', NULL, NULL, 15.5, 16.5, 3, '#39a2ff'),
('Break', NULL, NULL, 16.5, 16.75, 3, '#4f4f4f'),
('Governance Session', NULL, NULL, 16.75, 17.75, 3, '#536b8f'),
('Session 42', NULL, NULL, 16.75, 17.75, 3, '#39a2ff'),
('Session 43', NULL, NULL, 16.75, 17.75, 3, '#39a2ff'),
('Case Competition 4', NULL, NULL, 16.75, 17.75, 3, '#d93a3a'),
('Break', NULL, NULL, 17.75, 18.0, 3, '#4f4f4f'),
('Session 28', NULL, NULL, 18.0, 18.75, 3, '#39a2ff'),
('Session 29', NULL, NULL, 18.0, 18.75, 3, '#39a2ff'),
('Break', NULL, NULL, 18.75, 19.0, 3, '#4f4f4f'),
('Transportation to Evening Event', NULL, NULL, 19.0, 19.25, 3, '#4f4f4f'),
('Banquet', NULL, NULL, 19.25, 22.0, 3, '#ffb443');

-- Day 4 (Sunday, Jan 5)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Breakfast', 'Breakfast (Spectrum 3/4)', 'Spectrum 3/4', 7.5, 8.5, 4, '#649964'),
('Regional Meetings', NULL, NULL, 8.5, 9.0, 4, '#536b8f'),
('CFES Elections & Bids', NULL, NULL, 9.0, 10.0, 4, '#ffae26'),
('Round Tables', NULL, NULL, 10.0, 11.25, 4, '#39a2ff'),
('Break', NULL, NULL, 11.25, 11.5, 4, '#4f4f4f'),
('Session 46', NULL, NULL, 11.5, 12.5, 4, '#39a2ff'),
('Session 47', NULL, NULL, 11.5, 12.5, 4, '#39a2ff'),
('Session 48', NULL, NULL, 11.5, 12.5, 4, '#39a2ff'),
('Lunch', NULL, NULL, 12.5, 13.5, 4, '#649964'),
('General Assembly C', NULL, NULL, 13.5, 14.5, 4, '#ffae26'),
('Session 49', NULL, NULL, 13.5, 14.5, 4, '#39a2ff'),
('Session 50', NULL, NULL, 13.5, 14.5, 4, '#39a2ff'),
('Session 51', NULL, NULL, 13.5, 14.5, 4, '#39a2ff'),
('Break', NULL, NULL, 14.5, 14.75, 4, '#4f4f4f'),
('Case Competition 5', NULL, NULL, 14.75, 15.75, 4, '#d93a3a'),
('Session 52', NULL, NULL, 14.75, 15.75, 4, '#39a2ff'),
('Session 53', NULL, NULL, 14.75, 15.75, 4, '#39a2ff'),
('Break', NULL, NULL, 15.75, 16.0, 4, '#4f4f4f'),
('Session 54', NULL, NULL, 16.0, 17.0, 4, '#39a2ff'),
('Session 55', NULL, NULL, 16.0, 17.0, 4, '#39a2ff'),
('Transportation to Evening Event', NULL, NULL, 17.0, 18.25, 4, '#4f4f4f'),
('Charity Auction & Closing Ceremony', NULL, NULL, 18.25, 22.0, 4, '#ffb443');

-- Day 5 (Monday, Jan 6)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Breakfast', NULL, NULL, 7.5, 8.5, 5, '#649964'),
('Regional Meetings', NULL, NULL, 8.5, 9.0, 5, '#536b8f'),
('General Assembly B', NULL, NULL, 9.0, 10.0, 5, '#ffae26'),
('Engineering Change Lab', NULL, NULL, 9.0, 10.0, 5, '#39a2ff'),
('Something for the delegates', NULL, NULL, 9.0, 10.0, 5, '#39a2ff');

-- Day 6 (Tuesday, Jan 7)
INSERT INTO event (title, description, location, startHour, endHour, day, backgroundColor) VALUES
('Departures', NULL, NULL, 7.5, 24, 6, '#4f4f4f');

-- -- Default Event --
-- INSERT INTO default_events