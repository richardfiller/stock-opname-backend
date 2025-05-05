const { Client } = require('pg'); // Import library PostgreSQL
const XLSX = require('xlsx');

// Konfigurasi koneksi PostgreSQL (gunakan variabel lingkungan Netlify)
const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Penting untuk beberapa database hosting
  }
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    await pgClient.connect(); // Connect ke database

    const { namaUser, lokasi, kodeBarang, namaBarang, expDate, nomorLot, jumlah, keterangan } = JSON.parse(event.body);

    const result = await pgClient.query(
      'INSERT INTO stock_opname (nama_user, lokasi, kode_barang, nama_barang, exp_date, nomor_lot, jumlah, keterangan) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [namaUser, lokasi, kodeBarang, namaBarang, expDate, nomorLot, jumlah, keterangan]
    );

    await pgClient.end(); // Disconnect setelah query

    return {
      statusCode: 201,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (error) {
    console.error('Error saving stock opname data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save stock opname data: ' + error.message }),
    };
  }
};