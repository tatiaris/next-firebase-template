import { NextApiRequest, NextApiResponse } from 'next';
import { decode } from 'jsonwebtoken';
import { findOneObject } from '@lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const auth = decode(req.cookies.auth);
      const user = await findOneObject('users', auth['id']);
      res.status(200).json({ success: true, session: user });
    } catch (error) {
      res.status(200).json({
        success: true,
        session: {
          id: `guest-${Date.now()}`,
          username: '',
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
