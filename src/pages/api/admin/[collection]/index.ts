import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorData } from '@lib/helper';
import { getAllObjects, insertOneObject } from '@lib/firebase';
import { adminAuthorized, authenticated } from '@lib/auth';
import { adminQuery } from './[id]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    authenticated(
      adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
        const { collection } = req.query as adminQuery;
        try {
          const data = await getAllObjects(collection);
          res.status(200).json({ success: true, message: `Fetched ${collection}`, data });
        } catch (error) {
          const errorObj = error as Error;
          const errorData = getErrorData(errorObj);
          res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
        }
      })
    )(req, res);
  } else if (req.method === "POST") {
    authenticated((req: NextApiRequest, res: NextApiResponse) => {
      adminAuthorized((req: NextApiRequest, res: NextApiResponse) => {
        if (req.body.newObject) {
          const data = insertOneObject(req.query.collection as string, req.body.newObject);
          res.status(200).json({ success: true, message: `Inserted new object into ${req.query.collection}`, data });
        } else {
          res.status(400).json({ success: false, message: '400 - New object data not found', data: req.body });
        }
      })(req, res);
    })(req, res);

  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
