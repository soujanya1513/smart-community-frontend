import React from 'react';

// Generates a UPI QR code URL using Google Chart API
export function getUpiQrUrl({ upiId, amount, name, note }) {
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  // Use Google Chart API for QR code
  return `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(upiString)}`;
}

export default function UpiQr({ upiId, amount, name, note }) {
  if (!upiId || !amount) return null;
  const url = getUpiQrUrl({ upiId, amount, name, note });
  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <img src={url} alt="UPI QR Code" style={{ width: 200, height: 200 }} />
      <div style={{ marginTop: 10, fontSize: 16 }}>
        <b>Scan to Pay</b><br />
        <span>Amount: ₹{amount}</span>
      </div>
    </div>
  );
}
