import { authenticate, errorResponse } from "@api/lib/auth"
import { HttpStatus } from "@lib/constants";
import { NextRequest } from "next/server"

export const dynamic = 'auto'
export const revalidate = 60

export async function GET(request: NextRequest) {
  const [authenticated] = await authenticate(request);
  if (!authenticated) return errorResponse(HttpStatus.Unauthorized);

  const data = [
    {
      "id": "0",
      "timestamp": {
        "_seconds": 1630598400,
        "_nanoseconds": 0
      },
      "note": "currently in works!",
      "userId": "0",
      "name": "Rishabh Tatia",
      "color": "#fde047"
    }
  ]

  return Response.json(data);
}