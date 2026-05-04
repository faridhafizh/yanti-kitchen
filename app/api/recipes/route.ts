import { NextResponse } from 'next/server';
import { getRecipes, createRecipe } from '@/lib/api';
import { getAuthTokenFromCookies, verifyAuthToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const recipes = await getRecipes(limit);
    return NextResponse.json(recipes);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authToken = await getAuthTokenFromCookies();

  if (!authToken || !verifyAuthToken(authToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const newRecipe = await createRecipe(body);
    return NextResponse.json(newRecipe, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
