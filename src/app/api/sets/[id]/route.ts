import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/sets/[id] - Delete a set by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid set ID' },
        { status: 400 }
      );
    }

    // Check if set exists
    const existingSet = await prisma.set.findUnique({
      where: { id },
    });

    if (!existingSet) {
      return NextResponse.json(
        { error: 'Set not found' },
        { status: 404 }
      );
    }

    // Delete the set
    await prisma.set.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Set deleted successfully' });

  } catch (error) {
    console.error('Error deleting set:', error);
    return NextResponse.json(
      { error: 'Failed to delete set' },
      { status: 500 }
    );
  }
}