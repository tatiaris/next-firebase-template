import { NextApiRequest, NextApiResponse } from 'next';
import { authenticated, adminAuthorized } from '@lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    authenticated((req: NextApiRequest, res: NextApiResponse) => {
      adminAuthorized((req: NextApiRequest, res: NextApiResponse) => {
        res.status(200).json({ admin: true });
      })(req, res);
    })(req, res);
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
