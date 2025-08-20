import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables without exposing sensitive data
    const hasDatabase = !!process.env.DATABASE_URL;
    const hasRebrickableKey = !!process.env.REBRICKABLE_API_KEY;
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasDatabase,
        hasRebrickableKey,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}