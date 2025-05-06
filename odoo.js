require('dotenv').config();
const xmlrpc = require('xmlrpc');

const config = {
  url: process.env.ODOO_URL,
  db: process.env.ODOO_DB,
  username: process.env.ODOO_USERNAME
};

async function authenticate(apiKey) {
  const client = xmlrpc.createClient({ url: `${config.url}/xmlrpc/2/common` });
  return new Promise((resolve, reject) => {
    client.methodCall('authenticate', [config.db, config.username, apiKey, {}], (err, uid) => {
      if (err) reject(err);
      else resolve(uid);
    });
  });
}

async function createPartner(data, apiKey) {
  const uid = await authenticate(apiKey);
  const client = xmlrpc.createClient({ url: `${config.url}/xmlrpc/2/object` });

  return new Promise((resolve, reject) => {
    client.methodCall(
      'execute_kw',
      [
        config.db,
        uid,
        apiKey,
        'crm.lead',
        'create',
        [data]
      ],
      (err, value) => {
        if (err) reject(err);
        else resolve(value);
      }
    );
  });
}

module.exports = { createPartner };