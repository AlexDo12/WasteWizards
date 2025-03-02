// src/app/api/waste-statistics/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create a sql client
const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';

    try {
        // Define timeframe based on the requested range
        let query;

        if (timeRange === 'week') {
            query = sql`
        SELECT id, waste_type, bin_number, timestamp 
        FROM waste_items 
        WHERE timestamp >= NOW() - INTERVAL '7 days'
        ORDER BY timestamp DESC
      `;
        } else if (timeRange === 'month') {
            query = sql`
        SELECT id, waste_type, bin_number, timestamp 
        FROM waste_items 
        WHERE timestamp >= NOW() - INTERVAL '30 days'
        ORDER BY timestamp DESC
      `;
        } else {
            // All time - no condition needed
            query = sql`
        SELECT id, waste_type, bin_number, timestamp 
        FROM waste_items 
        ORDER BY timestamp DESC
      `;
        }

        // Execute the query
        const items = await query;

        return NextResponse.json(items);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({
            error: 'Failed to fetch waste statistics',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

// Add a POST endpoint to record new waste items
export async function POST(request: Request) {
    try {
        const { waste_type, bin_number } = await request.json();

        // Validate input
        if (!waste_type || !bin_number) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 });
        }

        // Insert the new waste item
        const result = await sql`
      INSERT INTO waste_items (waste_type, bin_number)
      VALUES (${waste_type}, ${bin_number})
      RETURNING id, timestamp
    `;

        return NextResponse.json({
            success: true,
            id: result[0].id,
            timestamp: result[0].timestamp
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({
            error: 'Failed to record waste item',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}