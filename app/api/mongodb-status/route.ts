import { connectToDatabase, mongoose } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Attempt to connect to MongoDB
    await connectToDatabase();
    
    // Get connection status
    const isConnected = mongoose.connection.readyState === 1;
    
    if (isConnected) {
      return NextResponse.json({
        status: 'success',
        message: '✅ Connected to MongoDB successfully!',
        details: {
          databaseName: mongoose.connection.name,
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          readyState: 'connected',
          timestamp: new Date().toISOString()
        }
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'MongoDB is not connected',
        readyState: mongoose.connection.readyState
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to MongoDB',
      error: error.message
    }, { status: 500 });
  }
}