const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the estimator server directory
dotenv.config({ path: path.join(__dirname, '../allbright-estimator/server/.env') });

async function testConnection() {
  console.log('Testing SMTP connection...');
  console.log('User:', process.env.EMAIL_USER || process.env.EMAIL);
  
  let pass = process.env.EMAIL_PASS || process.env.PASS;
  if (pass) {
    // Sanitize like the service does
    pass = pass.replace(/["\s]/g, '');
    console.log('Password (sanitized):', '*'.repeat(pass.length));
  } else {
    console.log('No password found in .env');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || process.env.EMAIL,
      pass: pass
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
  } catch (error) {
    console.error('❌ SMTP connection FAILED');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
  }
}

testConnection();
