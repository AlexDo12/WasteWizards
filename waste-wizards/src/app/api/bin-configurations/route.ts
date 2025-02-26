// app/api/bin-configurations/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create a sql client
const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    // Get all bin configurations
    const results = await sql`
      SELECT bin_number, waste_type 
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
      // Use the Neon SQL tagged template syntax for parameterized queries
      await sql`
        INSERT INTO bin_configurations (bin_number, waste_type) 
        VALUES (${config.bin_number}, ${config.waste_type})
        ON CONFLICT (bin_number) 
        DO UPDATE SET waste_type = ${config.waste_type}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update bin configurations' }, { status: 500 });
  }
}