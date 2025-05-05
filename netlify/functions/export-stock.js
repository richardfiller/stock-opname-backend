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
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    await pgClient.connect(); // Connect ke database

    const { rows } = await pgClient.query('SELECT * FROM stock_opname');

    await pgClient.end(); // Disconnect setelah query

    if (rows.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No stock opname data to export' }),
      };
    }

    const wsData = [
      Object.keys(rows[0]),
      ...rows.map((row) => Object.values(row)),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Opname Data');
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="stock_opname_data.xlsx"',
      },
      body: excelBuffer.toString('base64'), // Kirim sebagai base64 string
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to export data to Excel: ' + error.message }),
    };
  }
};