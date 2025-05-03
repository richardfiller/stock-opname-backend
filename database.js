const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',         // Host database (biasanya localhost jika berjalan di PC yang sama)
  port: 5432,                // Port default PostgreSQL
  user: 'postgres',          // Username default PostgreSQL (kecuali Anda mengubahnya)
  password: '023666', // Ganti dengan password yang Anda atur saat instalasi PostgreSQL
  database:'stock_opname_master', // Nama database yang telah kita buat
});

module.exports = pool;