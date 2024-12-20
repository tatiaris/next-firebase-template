import { authenticate } from "@api/lib/auth"
import { searchKeywords } from "@api/lib/firebase";
import { errorResponse } from "@api/lib/utils";
import { Note } from "@components/forms/note/metadata";
import { Collection, HttpStatus } from "@lib/constants";
import { NextRequest } from "next/server"

export const dynamic = 'auto';
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const [authenticated] = await authenticate(request);
    if (!authenticated) return errorResponse(HttpStatus.Unauthorized);

    const query = request.nextUrl.searchParams.get('q');
    if (!query) return Response.json([]);

    const data = await searchKeywords<Note>(Collection.Note, query);

    return Response.json(data);
  } catch (error) {
    return errorResponse(HttpStatus.InternalServerError);
  }
}