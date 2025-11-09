import XLSX from 'xlsx';

const workbook = XLSX.readFile('tmp/SCS 2025 S3.xlsx');

// Function to examine a sheet
function examineSheet(sheetName) {
  const separator = '================================================================================';
  console.log('\n' + separator);
  console.log('=== ' + sheetName + ' ===');
  console.log(separator);
  
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.log('Sheet not found!');
    return;
  }
  
  console.log('Sheet range:', sheet['!ref']);
  
  // Print first 25 rows, columns A-Z (0-25)
  console.log('\n--- First 25 rows, columns A-Z ---\n');
  
  for (let row = 0; row < 25; row++) {
    const cells = [];
    for (let col = 0; col < 26; col++) {
      const addr = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[addr];
      const value = cell ? (cell.v !== undefined ? cell.v : '') : '';
      cells.push(value);
    }
    
    // Only print rows with some content
    const hasContent = cells.some(c => c !== '');
    if (hasContent) {
      const colLetter = String.fromCharCode(65); // 'A'
      console.log('Row ' + (row + 1) + ':');
      cells.forEach((val, idx) => {
        if (val !== '') {
          const col = String.fromCharCode(65 + idx);
          console.log('  ' + col + ': ' + JSON.stringify(val));
        }
      });
      console.log('');
    }
  }
}

// Examine all three standings sheets
examineSheet('LMP3 Standings');
examineSheet('GT4 Standings');
examineSheet('GT3 Standings');
