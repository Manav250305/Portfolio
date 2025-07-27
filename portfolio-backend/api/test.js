// api/test.js - Create this file for debugging
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Check environment variables (without exposing sensitive data)
    const envCheck = {
      EMAIL_USER: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'MISSING',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'MISSING',
      NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL ? `${process.env.NOTIFICATION_EMAIL.substring(0, 3)}***` : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      runtime: 'Node.js ' + process.version,
      timestamp: new Date().toISOString()
    };

    console.log('Environment check:', envCheck);

    // Test basic nodemailer import
    try {
      const nodemailer = await import('nodemailer');
      envCheck.nodemailerImport = 'SUCCESS';
    } catch (importError) {
      envCheck.nodemailerImport = 'FAILED: ' + importError.message;
    }

    res.status(200).json({
      status: 'API is working',
      environment: envCheck,
      method: req.method,
      url: req.url
    });

  } catch (error) {
    console.error('Test API Error:', error);
    res.status(500).json({
      error: 'Test API failed',
      details: error.message,
      stack: error.stack
    });
  }
}