import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getErrorData } from '@/lib/helper';
import { getAllObjects, insertOneObject, updateOneObject } from '@/lib/firebase';
import { adminAuthorized, authenticated } from '@/lib/auth';
import { adminQuery } from './[id]';

const handler = nextConnect({ attachParams: true });

handler.get(
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
  )
);

handler.post(
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { collection } = req.query as adminQuery;
      try {
        if (req.body.newObject) {
          const data = await insertOneObject(collection, req.body.newObject);
          res.status(200).json({ success: true, message: `Inserted new object into ${collection}`, data });
        } else {
          throw new Error('400 - New object data not found');
        }
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
      }
    })
  )
);

export default handler;
