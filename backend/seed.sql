-- Sample Seed Data for Employee Directory
INSERT INTO employees (name, email, role)
VALUES 
    ('Alexander Wright', 'alex.wright@techcorp.io', 'Senior Full Stack Engineer'),
    ('Sophia Chen', 'sophia.chen@techcorp.io', 'Lead UI/UX Designer'),
    ('Marcus Johnson', 'marcus.j@techcorp.io', 'Backend Architect'),
    ('Elena Rostova', 'elena.r@techcorp.io', 'Product Manager'),
    ('Devon Vance', 'devon.vance@techcorp.io', 'DevOps & Cloud Specialist'),
    ('Priya Sharma', 'priya.s@techcorp.io', 'Frontend Developer'),
    ('Lucas Bennett', 'lucas.b@techcorp.io', 'QA Automation Engineer'),
    ('Maya Patel', 'maya.patel@techcorp.io', 'HR Talent Partner')
ON CONFLICT (email) DO NOTHING;
