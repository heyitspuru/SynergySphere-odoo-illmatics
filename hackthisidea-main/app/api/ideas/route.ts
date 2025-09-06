import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Idea } from '@/lib/models/idea';

// Helper function to handle errors
const handleError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  return NextResponse.json(
    { error: message },
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
};

// GET - Fetch all saved ideas
export async function GET() {
  try {
    await connectToDatabase();
    const ideas = await Idea.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(ideas, { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return handleError(error, 'Failed to fetch ideas');
  }
}

// POST - Save a new idea
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    await connectToDatabase();
    const idea = await Idea.create(body);
    
    return NextResponse.json(idea, { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return handleError(error, 'Failed to save idea');
  }
} 