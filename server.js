const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createPartner } = require('./odoo');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API Keys
const registerApiKey = process.env.ODOO_REGISTER_API_KEY;
const queryApiKey = process.env.ODOO_QUERY_API_KEY;

// 🎓 Student Registration Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, phone,  locationPreferences,  program ,   dateOfBirth  } = req.body;

    const description = `
Course: ${program || 'Not Provided'}
Location Preference: ${locationPreferences || 'Not Provided'}


Date Of Birth: ${dateOfBirth || 'Not Provided'}

Submitted via website form.
    `.trim();

    const id = await createPartner({
      name: `Student Registration - ${name}`,
      contact_name: name,
      email_from: email,
      phone,
      description
    }, registerApiKey);

    res.json({ success: true, id });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📩 Query Form Route
app.post('/query-form', async (req, res) => {
  try {
    const { name, email, phone, message , address , course } = req.body;

    const description = `
    Courses: ${course || 'No courses provided'},
    Address: ${address || 'No address provided'}
Message: ${message || 'No message provided'},

Submitted via query form.
    `.trim();

    const id = await createPartner({
      name: `Query Form - ${name}`,
      contact_name: name,
      email_from: email,
      
   
      phone,
      description
    }, queryApiKey);

    res.json({ success: true, id });
  } catch (err) {
    console.error('Query Form Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log('✅ Server running on http://localhost:4000');
});