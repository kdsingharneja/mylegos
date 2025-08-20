import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const confirmWebSearchSchema = z.object({
  setNumber: z.string().min(1, 'Set number is required'),
  name: z.string().min(1, 'Name is required'),
  year: z.number().min(1958).max(new Date().getFullYear() + 2),
  num_parts: z.number().min(0).max(20000),
  theme: z.string().optional(),
  set_img_url: z.string().optional(),
  confidence: z.number().min(0).max(100),
});

// POST /api/sets/web-search - Save confirmed web search result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const webSearchData = confirmWebSearchSchema.parse(body);

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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error saving web search result:', error);
    return NextResponse.json(
      { error: 'Failed to save set' },
      { status: 500 }
    );
  }
}