import 'server-only';
import { NextRequest, NextResponse } from 'next/server';

// Server-side API utilities
export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse(data: unknown, status: number = 200) {
  return NextResponse.json(data, { status });
}

export async function validateRequest(req: NextRequest, requiredFields: string[]) {
  try {
    const body = await req.json();
    const missing = requiredFields.filter(field => !body[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return body;
  } catch (error) {
    throw new Error('Invalid request body');
  }
}