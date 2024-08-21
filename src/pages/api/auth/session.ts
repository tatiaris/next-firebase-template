import { NextApiRequest, NextApiResponse } from 'next';
import { decode } from 'jsonwebtoken';
import { isAdmin, setSessionCookies } from '@lib/auth';
import { Collections } from 'src/lib/constants';
import { findObjectById } from '@lib/firebase';
import { UserObjectDB } from 'src/lib/types';

const getAuthTokenFromRequest = (req: NextApiRequest) => {
  const auth = req.headers.authorization;
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7);
  }
  return req.cookies.auth || '';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const token = getAuthTokenFromRequest(req);
      const auth = decode(token) as { id: string } | null;
      if (!auth || !auth['id'] || auth['id'] === undefined) throw new Error('No session found');
      const admin = await isAdmin(req.cookies.auth);
      const user = (await findObjectById(Collections.User, auth['id'])) as UserObjectDB;
      if (admin) {
        user['isAdmin'] = true;
      }
      setSessionCookies(res, user.id, user);
      res.status(200).json({ success: true, session: user });
    } catch (error) {
      res.status(200).json({
        success: true,
        session: {
          id: `guest-${Date.now()}`,
          name: '',
          username: '',
          email: '',
          picture: ''
        }
      });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
