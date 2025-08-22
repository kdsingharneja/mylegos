import { NextRequest, NextResponse } from 'next/server';
import { RebrickableService } from '@/services/rebrickable';

// Simple validation function for set numbers
function validateSetNumber(setNumber: unknown): { valid: boolean; error?: string; data?: string } {
  if (typeof setNumber !== 'string') {
    return { valid: false, error: 'Set number must be a string' };
  }
  
  const trimmed = setNumber.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Set number is required' };
  }
  
  // Basic LEGO set number validation (typically 4-6 digits, sometimes with suffix)
  if (!/^\d{4,6}(-\d+)?$/.test(trimmed)) {
    return { valid: false, error: 'Set number must be a valid LEGO set format (e.g., 21034, 75192-1)' };
  }
  
  return { valid: true, data: trimmed };
}

// POST /api/sets/validate - Validate and preview a set before adding
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validation = validateSetNumber(body.setNumber);
    if (!validation.valid) {
      return NextResponse.json({
        valid: false,
        error: validation.error,
      });
    }
    
    const setNumber = validation.data!;

    // Fetch set data from Rebrickable API
    const legoData = await RebrickableService.getSetByNumber(setNumber);
    
    return NextResponse.json({
      valid: true,
      setData: legoData,
    });

  } catch (error) {

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({
        valid: false,
        error: 'LEGO set not found',
      });
    }

    console.error('Error validating set:', error);
    return NextResponse.json(
      { error: 'Failed to validate set' },
      { status: 500 }
    );
  }
}