import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Idea } from '@/lib/models/idea';

interface Params {
  params: {
    id: string;
  };
}

// Helper function to handle errors
const handleError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  return NextResponse.json(
    { error: message },
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
};

// GET - Fetch a single idea by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    
    await connectToDatabase();
    const idea = await Idea.findById(id);
    
    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return NextResponse.json(idea, { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return handleError(error, 'Failed to fetch idea');
  }
}

// PATCH - Update an idea
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    
    await connectToDatabase();
    
    const updatedIdea = await Idea.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedIdea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return NextResponse.json(updatedIdea, { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return handleError(error, 'Failed to update idea');
  }
}

// DELETE - Delete an idea
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    
    await connectToDatabase();
    const deletedIdea = await Idea.findByIdAndDelete(id);
    
    if (!deletedIdea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return NextResponse.json(
      { message: 'Idea deleted successfully' },
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleError(error, 'Failed to delete idea');
  }
} 