import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const startTime = Date.now();
  
  try {
    
    
    // Test database connection
    const { data, error } = await supabase
      .from('businesses')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'connected',
        responseTime: `${responseTime}ms`
      },
      features: {
        merchantApproval: 'enabled',
        notifications: 'enabled',
        realTime: 'enabled'
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'disconnected',
        responseTime: `${responseTime}ms`
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
