import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CsvRow {
  setNumber?: string;
  'set_number'?: string;
  'Set Number'?: string;
}

async function importSetsFromCsv(filePath: string) {
  try {
    console.log('Reading CSV file:', filePath);
    const csvContent = readFileSync(filePath, 'utf-8');
    
    const records: CsvRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`Found ${records.length} records in CSV`);

    const imported = [];
    const failed = [];

    for (const record of records) {
      // Try different possible column names for set numbers
      const setNumber = record.setNumber || record['set_number'] || record['Set Number'];
      
      if (!setNumber) {
        failed.push({ record, error: 'No set number found in record' });
        continue;
      }

      try {
        // Check if set already exists
        const existingSet = await prisma.set.findUnique({
          where: { setNumber: setNumber.trim() },
        });

        if (existingSet) {
          console.log(`Set ${setNumber} already exists, skipping`);
          continue;
        }

        // Add to database
        const newSet = await prisma.set.create({
          data: {
            setNumber: setNumber.trim(),
          },
        });

        imported.push(newSet);
        console.log(`✓ Imported set: ${setNumber}`);
        
        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`✗ Failed to import set ${setNumber}:`, error);
        failed.push({ record, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    console.log('\n=== Import Summary ===');
    console.log(`Successfully imported: ${imported.length} sets`);
    console.log(`Failed to import: ${failed.length} sets`);

    if (failed.length > 0) {
      console.log('\nFailed imports:');
      failed.forEach(({ record, error }) => {
        const setNumber = record.setNumber || record['set_number'] || record['Set Number'] || 'Unknown';
        console.log(`  - ${setNumber}: ${error}`);
      });
    }

  } catch (error) {
    console.error('Error importing CSV:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: npx tsx scripts/import-csv.ts <path-to-csv-file>');
  console.error('Example: npx tsx scripts/import-csv.ts ./my-lego-sets.csv');
  process.exit(1);
}

importSetsFromCsv(filePath);