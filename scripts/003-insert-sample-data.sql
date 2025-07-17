-- Insert sample gallery items
INSERT INTO gallery (title, description, image_url, category) VALUES
('Annual Training Camp 2024', 'Cadets participating in the annual training camp at Goa', '/placeholder.svg?height=400&width=600', 'training'),
('Republic Day Parade', 'NCC cadets marching in the Republic Day parade', '/placeholder.svg?height=400&width=600', 'parade'),
('Adventure Training', 'Rock climbing and adventure activities', '/placeholder.svg?height=400&width=600', 'adventure'),
('Shooting Competition', 'Inter-college shooting competition winners', '/placeholder.svg?height=400&width=600', 'competition'),
('Social Service', 'Blood donation camp organized by NCC unit', '/placeholder.svg?height=400&width=600', 'service'),
('Cultural Program', 'Cultural evening during annual camp', '/placeholder.svg?height=400&width=600', 'cultural');

-- Insert sample news items
INSERT INTO news (title, content, summary, image_url, published) VALUES
('NCC Enrollment Open for 2024-25', 
'The National Cadet Corps enrollment for the academic year 2024-25 is now open. Students from all streams can apply online through our portal. The last date for submission is March 31, 2024.',
'NCC enrollment now open for 2024-25 academic year',
'/placeholder.svg?height=300&width=500',
true),

('Annual Training Camp Dates Announced', 
'The annual training camp will be conducted from May 15-25, 2024, at INS Mandovi, Goa. All selected cadets must report by 8:00 AM on May 15th.',
'Annual training camp scheduled for May 15-25, 2024',
'/placeholder.svg?height=300&width=500',
true),

('Outstanding Performance in Republic Day Parade', 
'Our NCC unit received appreciation for outstanding performance in the Republic Day parade. Three cadets were selected for the national level parade.',
'NCC unit excels in Republic Day parade',
'/placeholder.svg?height=300&width=500',
true);

-- Insert sample events
INSERT INTO events (title, description, event_date, location, registration_required, max_participants) VALUES
('Shooting Competition', 'Inter-college shooting competition for all wings', '2024-04-15 09:00:00', 'College Shooting Range', true, 50),
('Adventure Trek', 'Weekend adventure trek to nearby hills', '2024-04-20 06:00:00', 'Assembly Point - College Gate', true, 30),
('Blood Donation Camp', 'Annual blood donation drive', '2024-04-25 10:00:00', 'College Auditorium', false, NULL),
('Cultural Evening', 'Cultural program and talent show', '2024-05-01 18:00:00', 'College Auditorium', false, NULL);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
('What is the eligibility criteria for NCC enrollment?', 
'Students must be enrolled in a recognized educational institution, be between 13-26 years of age, and have good physical and mental health.',
'enrollment', 1),

('How long is the NCC training period?', 
'The basic NCC training is for 2-3 years depending on the certificate level (A, B, or C certificate).',
'training', 2),

('What are the benefits of joining NCC?', 
'NCC provides leadership training, character development, adventure activities, and preference in government job selections.',
'benefits', 3),

('Can I change my wing after enrollment?', 
'Wing changes are generally not allowed after enrollment. However, in exceptional cases, it may be considered by the commanding officer.',
'enrollment', 4),

('What documents are required for enrollment?', 
'You need academic certificates, birth certificate, medical fitness certificate, passport size photographs, and parent consent form.',
'documents', 5);
