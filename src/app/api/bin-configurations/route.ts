import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create a sql client
const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const trashcan = searchParams.get('trashcan');

    if (!trashcan) {
      return NextResponse.json({ error: 'Trashcan ID is required' }, { status: 400 });
    }

    // Get all bin configurations for the specific trashcan
    const results = await sql`
      SELECT trashcan, bin_number, waste_type, fill_level 
      FROM bin_config 
      WHERE trashcan = ${parseInt(trashcan)}
      ORDER BY bin_number
    `;

    return NextResponse.json(results);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch bin configurations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Process each configuration
    for (const config of data) {
      // Validate required fields
      if (!config.trashcan || !config.bin_number || !config.waste_type) {
        return NextResponse.json(
          { error: 'Trashcan ID, bin number, and waste type are required' },
          { status: 400 }
        );
      }

      // Get current bin configuration to verify if we should update
      const currentBin = await sql`
        SELECT * FROM bin_config 
        WHERE trashcan = ${config.trashcan} AND bin_number = ${config.bin_number}
      `;

      // First bin's waste type should never change
      if (config.bin_number === 1 && currentBin.length > 0) {
        // Only update fill_level for bin 1, keep waste_type the same
        await sql`
          UPDATE bin_config 
          SET fill_level = ${config.fill_level || 0.0}
          WHERE trashcan = ${config.trashcan} AND bin_number = 1
        `;
      }
      // For other bins, only allow update if fill_level < 5.00
      else if (config.bin_number !== 1 && (currentBin.length === 0 || currentBin[0].fill_level < 5.00)) {
        await sql`
          INSERT INTO bin_config (trashcan, bin_number, waste_type, fill_level) 
          VALUES (${config.trashcan}, ${config.bin_number}, ${config.waste_type}, ${config.fill_level || 0.0})
          ON CONFLICT (trashcan, bin_number) 
          DO UPDATE SET 
            waste_type = ${config.waste_type},
            fill_level = ${config.fill_level || 0.0}
        `;
      }
      // If it's a new bin 1 configuration (should be rare but handling it)
      else if (config.bin_number === 1 && currentBin.length === 0) {
        await sql`
          INSERT INTO bin_config (trashcan, bin_number, waste_type, fill_level) 
          VALUES (${config.trashcan}, ${config.bin_number}, ${config.waste_type}, ${config.fill_level || 0.0})
        `;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update bin configurations' }, { status: 500 });
  }
}