// startup-check.js - Run this to diagnose issues
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔍 Running startup diagnostics...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('PORT:', process.env.PORT || 'Not set (will use 5000)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set (will use http://localhost:3000)');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set ✅' : 'Not set (will use local MongoDB)');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set ✅' : 'Not set ⚠️');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set ✅' : 'Not set ⚠️');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'Not set (will use gmail)');
console.log('NOTIFICATION_EMAIL:', process.env.NOTIFICATION_EMAIL || 'Not set (will use EMAIL_USER)');
console.log('\n');

// Test MongoDB connection
async function testMongoDB() {
  console.log('🗄️  Testing MongoDB connection...');
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    console.log('Connection URI:', uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(uri);
    
    console.log('✅ MongoDB connection successful!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Solution: Start MongoDB locally with: brew services start mongodb-community');
      console.log('💡 Or use MongoDB Atlas: https://www.mongodb.com/atlas');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Solution: Check your MongoDB credentials');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Solution: Check your network connection or MongoDB Atlas whitelist');
    }
  }
}

// Test email configuration
async function testEmail() {
  console.log('\n📧 Testing email configuration...');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email not configured (missing EMAIL_USER or EMAIL_PASS)');
    console.log('💡 This is optional - contact form will work without email notifications');
    return;
  }
  
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await transporter.verify();
    console.log('✅ Email configuration successful!');
  } catch (error) {
    console.error('❌ Email configuration failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('💡 Solution: Generate an App Password in Gmail settings');
      console.log('💡 Steps: Gmail Settings → Security → 2-Step Verification → App passwords');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Solution: Check EMAIL_USER and EMAIL_PASS in .env file');
    }
  }
}

// Run all tests
async function runDiagnostics() {
  await testMongoDB();
  await testEmail();
  
  console.log('\n🎯 Next steps:');
  console.log('1. Fix any issues shown above');
  console.log('2. Run: npm run dev');
  console.log('3. Visit: http://localhost:5000/api/health');
  
  process.exit(0);
}

runDiagnostics().catch(error => {
  console.error('❌ Diagnostic failed:', error);
  process.exit(1);
});