import { query, pool } from '../config/db.js';

const seedData = [
  { name: 'Alexander Wright', email: 'alex.wright@techcorp.io', role: 'Senior Full Stack Engineer' },
  { name: 'Sophia Chen', email: 'sophia.chen@techcorp.io', role: 'Lead UI/UX Designer' },
  { name: 'Marcus Johnson', email: 'marcus.j@techcorp.io', role: 'Backend Architect' },
  { name: 'Elena Rostova', email: 'elena.r@techcorp.io', role: 'Product Manager' },
  { name: 'Devon Vance', email: 'devon.vance@techcorp.io', role: 'DevOps & Cloud Specialist' },
  { name: 'Priya Sharma', email: 'priya.s@techcorp.io', role: 'Frontend Developer' },
  { name: 'Lucas Bennett', email: 'lucas.b@techcorp.io', role: 'QA Automation Engineer' },
  { name: 'Maya Patel', email: 'maya.patel@techcorp.io', role: 'HR Talent Partner' },
  { name: 'David Kim', email: 'david.kim@techcorp.io', role: 'Engineering Manager' },
  { name: 'Olivia Martin', email: 'olivia.m@techcorp.io', role: 'Data Scientist' },
  { name: 'Ethan Miller', email: 'ethan.m@techcorp.io', role: 'Mobile Developer' },
  { name: 'Aisha Al-Mansoor', email: 'aisha.m@techcorp.io', role: 'Security Analyst' }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    for (const emp of seedData) {
      await query(
        `INSERT INTO employees (name, email, role) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) DO UPDATE 
         SET name = EXCLUDED.name, role = EXCLUDED.role`,
        [emp.name, emp.email, emp.role]
      );
    }
    console.log('✅ Seed completed successfully! Added/updated 12 employee records.');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await pool.end();
  }
}

seed();
