import { NextResponse } from 'next/server';
import { getRecipes, createRecipe } from '@/lib/api';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const recipes = await getRecipes();
    return NextResponse.json(recipes);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token');

  if (!authToken) {
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
