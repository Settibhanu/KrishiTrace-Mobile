const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const BATCHES = [
  'HV-1',
  'HV-2',
  'HV-3',
  'HV-4',
  'HV-5',
];

const OUTPUT_DIR = path.join(__dirname, 'assets', 'sample-qr');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateQRCodes() {
  console.log('Generating QR codes...\n');
  
  for (const batchId of BATCHES) {
    const filePath = path.join(OUTPUT_DIR, `${batchId}.png`);
    
    await QRCode.toFile(filePath, batchId, {
      width: 400,
      margin: 2,
      color: {
        dark: '#203120',
        light: '#ffffff',
      },
    });
    
    console.log(`✓ Generated: ${batchId}.png`);
  }
  
  console.log(`\n✅ All QR codes saved to: ${OUTPUT_DIR}`);
  console.log('\nBatch IDs:');
  BATCHES.forEach(id => console.log(`  - ${id}`));
}

generateQRCodes().catch(console.error);