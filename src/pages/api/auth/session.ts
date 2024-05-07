import { NextApiRequest, NextApiResponse } from 'next';
import { decode } from 'jsonwebtoken';
import { findOneObject } from '@lib/firebase';
import { isAdmin } from '@lib/auth';
import { Collections } from '@lib/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const auth = decode(req.cookies.auth);
      const admin = await isAdmin(req.cookies.auth);
      const user = await findOneObject(Collections.User, auth['id']);
      if (admin) {
        user.isAdmin = true;
      }
      res.status(200).json({ success: true, session: user });
    } catch (error) {
      res.status(200).json({
        success: true,
        session: {
          id: `guest-${Date.now()}`,
          name: '',
          email: '',
          photoURL: ''
        }
      });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
