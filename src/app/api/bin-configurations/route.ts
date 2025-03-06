// app/api/bin-configurations/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create a sql client
const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    // Get all bin configurations including capacity
    const results = await sql`
      SELECT bin_number, waste_type, capacity 
      FROM bin_configurations 
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
      // Get current bin configuration to verify if we should update
      const currentBin = await sql`
        SELECT * FROM bin_configurations WHERE bin_number = ${config.bin_number}
      `;

      // First bin's waste type should never change
      if (config.bin_number === 1 && currentBin.length > 0) {
        // Only update capacity for bin 1, keep waste_type the same
        await sql`
          UPDATE bin_configurations 
          SET capacity = ${config.capacity || 0}
          WHERE bin_number = 1
        `;
      }
      // For other bins, only allow update if capacity < 5.00
      else if (config.bin_number !== 1 && (currentBin.length === 0 || currentBin[0].capacity < 5.00)) {
        await sql`
          INSERT INTO bin_configurations (bin_number, waste_type, capacity) 
          VALUES (${config.bin_number}, ${config.waste_type}, ${config.capacity || 0})
          ON CONFLICT (bin_number) 
          DO UPDATE SET 
            waste_type = ${config.waste_type},
            capacity = ${config.capacity || 0}
        `;
      }
      // If it's a new bin 1 configuration (should be rare but handling it)
      else if (config.bin_number === 1 && currentBin.length === 0) {
        await sql`
          INSERT INTO bin_configurations (bin_number, waste_type, capacity) 
          VALUES (${config.bin_number}, ${config.waste_type}, ${config.capacity || 0})
        `;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update bin configurations' }, { status: 500 });
  }
}