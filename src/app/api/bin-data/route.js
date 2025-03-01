import { NextResponse } from 'next/server';

// placeholder to compile on vercel
export async function GET(request) {
  try {
    const binData = [
    ];
    
    return NextResponse.json({ data: binData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bin data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Process the data
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}