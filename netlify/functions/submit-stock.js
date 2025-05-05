const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const data = JSON.parse(event.body);
        const filePath = path.join(__dirname, '..', 'data', 'stock_data.json');

        // Baca data yang sudah ada
        let existingData = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            existingData = JSON.parse(fileContent);
        } catch (error) {
            // Jika file belum ada, biarkan array kosong
        }

        // Tambahkan data baru
        existingData.push(data);

        // Tulis kembali ke file
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf8');

        return { statusCode: 200, body: JSON.stringify({ message: 'Data stock opname berhasil disimpan!' }) };

    } catch (error) {
        console.error('Gagal menyimpan data stock opname:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Gagal menyimpan data stock opname.' + error.message }) };
    }
};