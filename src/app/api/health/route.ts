import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic function test
    const timestamp = new Date().toISOString();
    
    // Check environment variables without exposing sensitive data
    const hasDatabase = !!process.env.DATABASE_URL;
    const hasRebrickableKey = !!process.env.REBRICKABLE_API_KEY;
    
    // Get database URL prefix to verify it's loaded (without exposing the full URL)
    const dbUrlPrefix = process.env.DATABASE_URL?.substring(0, 10) || 'not found';
    
    return NextResponse.json({
      status: 'ok',
      timestamp,
      message: 'Health check successful',
      environment: {
        hasDatabase,
        hasRebrickableKey,
        nodeEnv: process.env.NODE_ENV || 'undefined',
        dbUrlPrefix,
        platform: process.platform,
        // Check if this is running on Vercel
        isVercel: !!process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV || 'not set'
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Also support POST for debugging
export async function POST() {
  return GET();
}