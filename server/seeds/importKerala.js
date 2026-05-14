const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Doctor = require('../models/Doctor');
const config = require('../config/config');

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());

  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

function parseExperience(val) {
  const n = parseInt(val.replace('+', '').trim(), 10);
  return isNaN(n) ? 0 : n;
}

const importKerala = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const csvPath = path.join(__dirname, 'kerala_doctors.csv');
    const content = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(content);

    const doctors = rows.map(row => {
      const city = row['City'] || '';
      const district = row['District'] || '';
      const address = [city, district, 'Kerala'].filter(Boolean).join(', ');

      return {
        name: row['Doctor Name'],
        specialization: row['Specialisation'],
        hospital: row['Hospital / Clinic'],
        address,
        phone: row['Hospital Contact'],
        experience: parseExperience(row['Experience (Yrs)']),
        isActive: true
      };
    }).filter(d => d.name && d.specialization && d.hospital);

    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    const inserted = await Doctor.insertMany(doctors);
    console.log(`${inserted.length} Kerala doctors imported successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Import error:', error.message);
    process.exit(1);
  }
};

importKerala();
