import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '@lib/helper';
import { adminAuthorized, authenticated } from '@lib/auth';
import { adminQuery } from './[id]';
import { addObjectToCollection, getCollection } from '@lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { collection } = req.query as adminQuery;
      switch (req.method) {
        case 'GET':
          try {
            const collectionSnapshot = await getCollection(collection);
            const promises = collectionSnapshot.docs.map(async (doc) => doc.data());
            const data = await Promise.all(promises);
            res.status(200).json({ success: true, message: `Fetched ${collection}`, data });
          } catch (error) {
            handleError(error, res);
          }
          break;
        case 'POST':
          if (req.body.newObject) {
            const data = await addObjectToCollection(req.query.collection as string, req.body.newObject);
            res.status(200).json({ success: true, message: `Inserted new object into ${req.query.collection}`, data });
          } else {
            res.status(400).json({ success: false, message: '400 - New object data not found', data: req.body });
          }
          break;
        default:
          res.setHeader('Allow', ['GET', 'POST']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
          break;
      }
    })
  )(req, res);
}
