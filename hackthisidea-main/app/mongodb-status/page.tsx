'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface MongoDBStatus {
  status: string;
  message: string;
  details?: {
    databaseName: string;
    host: string;
    port: string;
    readyState: string;
    timestamp: string;
  };
  error?: string;
}

export default function MongoDBStatusPage() {
  const [status, setStatus] = useState<MongoDBStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkMongoDBStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mongodb-status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error checking MongoDB status:', error);
      setStatus({
        status: 'error',
        message: 'Failed to check MongoDB status',
        error: 'Network error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMongoDBStatus();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">MongoDB Connection Status</h1>
      
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            MongoDB Status
            <Button onClick={checkMongoDBStatus} disabled={loading}>
              {loading ? 'Checking...' : 'Refresh Status'}
            </Button>
          </CardTitle>
          <CardDescription>
            Current status of the MongoDB connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : status ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Status:</span>
                <Badge variant={status.status === 'success' ? 'default' : 'destructive'}>
                  {status.status.toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Message:</span>
                <p className="mt-1 text-lg">{status.message}</p>
              </div>

              {status.details && (
                <div className="border rounded-md p-4 bg-slate-50">
                  <h3 className="font-medium mb-2">Connection Details:</h3>
                  <ul className="space-y-2">
                    <li><span className="font-medium">Database Name:</span> {status.details.databaseName}</li>
                    <li><span className="font-medium">Host:</span> {status.details.host}</li>
                    <li><span className="font-medium">Port:</span> {status.details.port}</li>
                    <li><span className="font-medium">Ready State:</span> {status.details.readyState}</li>
                    <li><span className="font-medium">Timestamp:</span> {new Date(status.details.timestamp).toLocaleString()}</li>
                  </ul>
                </div>
              )}

              {status.error && (
                <div className="border border-red-200 rounded-md p-4 bg-red-50">
                  <h3 className="font-medium text-red-700 mb-2">Error Details:</h3>
                  <p className="text-red-600">{status.error}</p>
                </div>
              )}
            </div>
          ) : (
            <p>No status information available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}