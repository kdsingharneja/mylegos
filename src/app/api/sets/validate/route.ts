import { NextRequest, NextResponse } from 'next/server';
import { RebrickableService } from '@/services/rebrickable';
import { z } from 'zod';

const validateSetSchema = z.object({
  setNumber: z.string().min(1, 'Set number is required'),
});

// POST /api/sets/validate - Validate and preview a set before adding
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { setNumber } = validateSetSchema.parse(body);

    // Fetch set data from Rebrickable API
    const legoData = await RebrickableService.getSetByNumber(setNumber);
    
    return NextResponse.json({
      valid: true,
      setData: legoData,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

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