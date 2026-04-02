const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const migrationPath = path.join(__dirname, '..', 'prisma', 'migrations', '20260205110416_init', 'migration.sql');

console.log('Initializing database...');
console.log('DB Path:', dbPath);
console.log('Migration Path:', migrationPath);

const db = new Database(dbPath);
const migration = fs.readFileSync(migrationPath, 'utf8');

try {
  db.exec(migration);
  console.log('✓ Database initialized successfully!');
  
  // Verify tables were created
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Created tables:', tables.map(t => t.name).join(', '));
} catch (error) {
  console.error('Error initializing database:', error);
  process.exit(1);
} finally {
  db.close();
}
