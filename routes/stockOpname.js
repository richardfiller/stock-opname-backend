const express = require('express');
const router = express.Router();
const pool = require('../database');
const XLSX = require('xlsx'); // Import library xlsx

router.post('/submit', async (req, res) => {
  const { namaUser, lokasi, kodeBarang, namaBarang, expDate, nomorLot, jumlah, keterangan } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO stock_opname (nama_user, lokasi, kode_barang, nama_barang, exp_date, nomor_lot, jumlah, keterangan) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [namaUser, lokasi, kodeBarang, namaBarang, expDate, nomorLot, jumlah, keterangan]
    );
    res.status(201).json(result.rows[0]); // Mengirim kembali data yang baru disimpan
  } catch (error) {
    console.error('Error saving stock opname data:', error);
    res.status(500).json({ error: 'Failed to save stock opname data' });
  }
});

router.get('/export', async (req, res) => {
  try {
    // 1. Ambil data dari database PostgreSQL
    const { rows } = await pool.query('SELECT * FROM stock_opname'); // Ganti 'stock_opname' jika nama tabel Anda berbeda

    if (rows.length === 0) {
      return res.status(200).json({ message: 'No stock opname data to export' });
    }

    // 2. Buat data untuk worksheet Excel
    const wsData = [
      Object.keys(rows[0]), // Header kolom
      ...rows.map(row => Object.values(row)), // Data baris
    ];

    // 3. Buat workbook dan worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // 4. Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Opname Data');

    // 5. Buat buffer file Excel
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // 6. Kirim buffer sebagai respons
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="stock_opname_data.xlsx"');
    res.send(excelBuffer);

  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    res.status(500).json({ error: 'Failed to export data to Excel' });
  }
});

module.exports = router;