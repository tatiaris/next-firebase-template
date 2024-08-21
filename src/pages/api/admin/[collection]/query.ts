import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuthorized, authenticated } from '@lib/auth';
import { adminQuery } from './[id]';
import { findObjectByFilter } from '@lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { collection } = req.query as adminQuery;
      switch (req.method) {
        case 'POST':
          if (req.body.key && req.body.value) {
            const data = await findObjectByFilter(collection as string, req.body.key, '==', req.body.value);
            res.status(200).json({ success: true, message: `Found matching ${req.query.collection}`, data });
          } else {
            res.status(400).json({ success: false, message: '400 - No matching object data found', data: req.body });
          }
          break;
        default:
          res.setHeader('Allow', ['POST']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
          break;
      }
    })
  )(req, res);
}
