// src/app/api/waste-statistics/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create a sql client
const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';
    const trashcan = searchParams.get('trashcan') || '1'; // Default to trashcan 1 if not specified

    try {
        // Define timeframe based on the requested range
        let query;

        if (timeRange === 'week') {
            query = sql`
        SELECT id, waste_type, bin_number, time, username, trashcan 
        FROM waste_items 
        WHERE time >= NOW() - INTERVAL '7 days'
        AND trashcan = ${parseInt(trashcan)}
        ORDER BY time DESC
      `;
        } else if (timeRange === 'month') {
            query = sql`
        SELECT id, waste_type, bin_number, time, username, trashcan 
        FROM waste_items 
        WHERE time >= NOW() - INTERVAL '30 days'
        AND trashcan = ${parseInt(trashcan)}
        ORDER BY time DESC
      `;
        } else {
            // All time - just filter by trashcan
            query = sql`
        SELECT id, waste_type, bin_number, time, username, trashcan 
        FROM waste_items 
        WHERE trashcan = ${parseInt(trashcan)}
        ORDER BY time DESC
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
        const { waste_type, bin_number, username, trashcan = 1 } = await request.json();

        // Validate input
        if (!waste_type || !bin_number || !username) {
            return NextResponse.json({
                error: 'Missing required fields: waste_type, bin_number, and username are required'
            }, { status: 400 });
        }

        // Insert the new waste item
        const result = await sql`
      INSERT INTO waste_items (waste_type, bin_number, username, trashcan)
      VALUES (${waste_type}, ${bin_number}, ${username}, ${trashcan})
      RETURNING id, time
    `;

        return NextResponse.json({
            success: true,
            id: result[0].id,
            time: result[0].time
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({
            error: 'Failed to record waste item',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}