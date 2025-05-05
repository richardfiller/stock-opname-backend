const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.saveStockOpname = onRequest(async (req, res) => {
  try {
    logger.info("Menerima permintaan penyimpanan data stock opname", { structuredData: true });

    const data = req.body;

    // Tambahkan timestamp server saat data disimpan
    data.timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Tentukan nama collection di Firestore
    const collectionName = 'stockOpnames'; // Ganti dengan nama collection yang Anda inginkan

    // Simpan data ke Firestore
    const docRef = await db.collection(collectionName).add(data);

    logger.info("Data stock opname berhasil disimpan dengan ID:", docRef.id);

    // Kirim respons sukses ke frontend
    res.status(200).send({ message: 'Data stock opname berhasil disimpan!', id: docRef.id });

  } catch (error) {
    logger.error("Gagal menyimpan data stock opname:", error);
    // Kirim respons error ke frontend
    res.status(500).send({ error: 'Gagal menyimpan data stock opname.' });
  }
});

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});