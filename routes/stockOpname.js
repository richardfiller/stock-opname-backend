import React, { useState } from 'react';

const StockOpnameForm = () => {
  const [formData, setFormData] = useState({
    namaUser: '',
    lokasi: '',
    kodeBarang: '',
    namaBarang: '',
    expDate: '',
    nomorLot: '',
    jumlah: '',
    keterangan: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('loading');

    try {
      const response = await fetch('/.netlify/functions/submit-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data berhasil disimpan:', data);
        setSubmissionStatus('success');
        // Reset form setelah berhasil
        setFormData({
          namaUser: '',
          lokasi: '',
          kodeBarang: '',
          namaBarang: '',
          expDate: '',
          nomorLot: '',
          jumlah: '',
          keterangan: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Gagal menyimpan data:', errorData);
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Ada kesalahan:', error);
      setSubmissionStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="namaUser">Nama User:</label>
        <input type="text" id="namaUser" name="namaUser" value={formData.namaUser} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="lokasi">Lokasi:</label>
        <input type="text" id="lokasi" name="lokasi" value={formData.lokasi} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="kodeBarang">Kode Barang:</label>
        <input type="text" id="kodeBarang" name="kodeBarang" value={formData.kodeBarang} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="namaBarang">Nama Barang:</label>
        <input type="text" id="namaBarang" name="namaBarang" value={formData.namaBarang} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="expDate">EXP. Date:</label>
        <input type="date" id="expDate" name="expDate" value={formData.expDate} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="nomorLot">Nomor Lot:</label>
        <input type="text" id="nomorLot" name="nomorLot" value={formData.nomorLot} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="jumlah">Jumlah:</label>
        <input type="number" id="jumlah" name="jumlah" value={formData.jumlah} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="keterangan">Keterangan:</label>
        <textarea id="keterangan" name="keterangan" value={formData.keterangan} onChange={handleChange} />
      </div>
      <button type="submit" disabled={submissionStatus === 'loading'}>
        {submissionStatus === 'loading' ? 'Loading...' : 'Simpan'}
      </button>
      {submissionStatus === 'success' && <p style={{ color: 'green' }}>Data berhasil disimpan!</p>}
      {submissionStatus === 'error' && <p style={{ color: 'red' }}>Gagal menyimpan data.</p>}
    </form>
  );
};

export default StockOpnameForm;