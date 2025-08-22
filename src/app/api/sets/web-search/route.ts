import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple validation function for web search data
function validateWebSearchData(data: any): { valid: boolean; error?: string; data?: any } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }

  // Validate required fields
  if (typeof data.setNumber !== 'string' || data.setNumber.trim().length === 0) {
    return { valid: false, error: 'Set number is required' };
  }
  
  if (typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (typeof data.year !== 'number' || data.year < 1958 || data.year > new Date().getFullYear() + 2) {
    return { valid: false, error: 'Year must be between 1958 and ' + (new Date().getFullYear() + 2) };
  }

  if (typeof data.num_parts !== 'number' || data.num_parts < 0 || data.num_parts > 20000) {
    return { valid: false, error: 'Number of parts must be between 0 and 20000' };
  }

  if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 100) {
    return { valid: false, error: 'Confidence must be between 0 and 100' };
  }

  // Optional fields
  if (data.theme && typeof data.theme !== 'string') {
    return { valid: false, error: 'Theme must be a string' };
  }

  if (data.set_img_url && typeof data.set_img_url !== 'string') {
    return { valid: false, error: 'Image URL must be a string' };
  }

  return { valid: true, data };
}

// POST /api/sets/web-search - Save confirmed web search result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validation = validateWebSearchData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const webSearchData = validation.data;

    // Check if set already exists
    const existingSet = await prisma.set.findUnique({
      where: { setNumber: webSearchData.setNumber },
    });

    if (existingSet) {
      return NextResponse.json(
        { error: 'Set already exists in collection' },
        { status: 409 }
      );
    }

    // Add to database with web search metadata
    const newSet = await prisma.set.create({
      data: {
        setNumber: webSearchData.setNumber,
        source: 'web_search',
        confidence: webSearchData.confidence,
        manualOverride: false,
      },
    });

    // Return combined data
    return NextResponse.json({
      ...newSet,
      set_num: `${webSearchData.setNumber}-1`,
      name: webSearchData.name,
      year: webSearchData.year,
      num_parts: webSearchData.num_parts,
      theme: webSearchData.theme,
      set_img_url: webSearchData.set_img_url || '',
      isStored: true,
      source: 'web_search',
      confidence: webSearchData.confidence,
    }, { status: 201 });

  } catch (error) {

    console.error('Error saving web search result:', error);
    return NextResponse.json(
      { error: 'Failed to save set' },
      { status: 500 }
    );
  }
}