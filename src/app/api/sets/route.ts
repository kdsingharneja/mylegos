import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RebrickableService } from '@/services/rebrickable';
import { LegoSearchService } from '@/services/legoSearchService';

// Simple validation function to replace Zod
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

// GET /api/sets - Get all sets from database
export async function GET() {
  try {
    const sets = await prisma.set.findMany({
      orderBy: {
        dateAdded: 'desc',
      },
    });

    if (sets.length === 0) {
      return NextResponse.json([]);
    }

    // Try Rebrickable API first, then web search fallback for missing sets
    const results = await Promise.allSettled(
      sets.map(async (set, index) => {
        try {
          // Add a small delay between requests to avoid rate limiting
          if (index > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          const legoData = await RebrickableService.getSetByNumber(set.setNumber);
          return {
            ...set,
            ...legoData,
            isStored: true,
            source: set.source || 'rebrickable',
            confidence: set.confidence || 100,
            manualOverride: set.manualOverride || false,
          };
        } catch (error) {
          console.log(`Rebrickable API failed for set ${set.setNumber}, trying web search...`);
          
          // Try web search fallback
          try {
            const webSearchData = await LegoSearchService.getSetInfo(set.setNumber);
            if (webSearchData && 'requiresConfirmation' in webSearchData) {
              return {
                ...set,
                ...webSearchData,
                isStored: true,
                needsConfirmation: webSearchData.requiresConfirmation,
              };
            }
          } catch (webSearchError) {
            console.log(`Web search also failed for set ${set.setNumber}`);
          }
          
          // Final fallback: basic set info
          return {
            ...set,
            name: `Set ${set.setNumber}`,
            year: 0,
            num_parts: 0,
            set_img_url: '',
            isStored: true,
            apiError: true,
            source: set.source || 'rebrickable',
            confidence: set.confidence || 100,
            manualOverride: set.manualOverride || false,
          };
        }
      })
    );

    const finalResults = results.map((result) => 
      result.status === 'fulfilled' ? result.value : null
    ).filter(Boolean);

    return NextResponse.json(finalResults);
  } catch (error) {
    console.error('Error fetching sets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sets' },
      { status: 500 }
    );
  }
}

// POST /api/sets - Add a new set
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validation = validateSetNumber(body.setNumber);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const setNumber = validation.data!;

    // Check if set already exists
    const existingSet = await prisma.set.findUnique({
      where: { setNumber },
    });

    if (existingSet) {
      return NextResponse.json(
        { error: 'Set already exists in collection' },
        { status: 409 }
      );
    }

    // Validate set exists in Rebrickable API
    const legoData = await RebrickableService.getSetByNumber(setNumber);
    
    // Add to database
    const newSet = await prisma.set.create({
      data: {
        setNumber,
      },
    });

    // Return combined data
    return NextResponse.json({
      ...newSet,
      ...legoData,
      isStored: true,
    }, { status: 201 });

  } catch (error) {

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'LEGO set not found' },
        { status: 404 }
      );
    }

    console.error('Error adding set:', error);
    return NextResponse.json(
      { error: 'Failed to add set' },
      { status: 500 }
    );
  }
}