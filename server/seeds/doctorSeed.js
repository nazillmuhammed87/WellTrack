const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Doctor = require('../models/Doctor');
const config = require('../config/config');

const CSV_PATH = path.join(__dirname, 'kerala_doctors.csv');

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split('","').map(h => h.replace(/^"|"$/g, '').trim());

  return lines.slice(1).map(line => {
    const values = line.split('","').map(v => v.replace(/^"|"$/g, '').trim());
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

function parseExperience(expStr) {
  if (!expStr || expStr === '—') return 0;
  const num = parseFloat(expStr.replace('+', ''));
  return isNaN(num) ? 0 : Math.floor(num);
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '.');
}

const DEFAULT_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const seedDoctors = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const rows = parseCSV(CSV_PATH);

    const doctors = rows.map(row => ({
      name: row['Doctor Name'],
      email: `${toSlug(row['Doctor Name'])}@kerala.hospital`,
      phone: row['Hospital Contact'] !== '—' ? row['Hospital Contact'] : undefined,
      specialization: row['Specialisation'],
      hospital: row['Hospital / Clinic'],
      address: `${row['City']}, ${row['District']}, Kerala`,
      experience: parseExperience(row['Experience (Yrs)']),
      rating: parseFloat((4.0 + Math.random()).toFixed(1)),
      availableDays: DEFAULT_DAYS,
      availableTime: { from: '09:00', to: '17:00' },
      consultationFee: 200,
      isActive: true
    }));

    await Doctor.deleteMany({});
    await Doctor.insertMany(doctors);
    console.log(`${doctors.length} Kerala doctors seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDoctors();
