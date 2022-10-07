import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { authenticated, adminAuthorized } from '@/lib/auth';

const handler = nextConnect();

handler.get(
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      res.status(200).json({ admin: true });
    })
  )
);

export default handler;
