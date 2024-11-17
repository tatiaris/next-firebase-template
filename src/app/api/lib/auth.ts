import { auth } from './firebase';
import { NextRequest } from 'next/server';
import { HttpStatus } from '@lib/constants';
import { DecodedIdToken } from 'node_modules/firebase-admin/lib/auth/token-verifier';

export const authenticate = async (request: NextRequest) => {
  const headers = new Headers(request.headers);
  const authToken = headers.get('Authorization')?.split(' ')[1];
  let user: DecodedIdToken;
  if (!authToken) return [false, null];
  else {
    try {
      user = await auth.verifyIdToken(authToken);
    } catch (error) {
      console.error(error);
      return [false, null];
    }
    return [true, user];
  }
};