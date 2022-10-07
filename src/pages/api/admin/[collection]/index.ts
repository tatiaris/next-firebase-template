import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getErrorData } from '@/lib/helper';
import { getAllObjects, insertOneObject, updateOneObject } from '@/lib/firebase';
import { adminAuthorized, authenticated } from '@/lib/auth';

const handler = nextConnect({ attachParams: true });

handler.get(
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { collection } = req.query;
      try {
        const data = await getAllObjects(collection);
        res.status(200).json({ success: true, data });
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, data: errorData.message });
      }
    })
  )
);

handler.post(
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { collection } = req.query;
      try {
        if (req.body.newObject) {
          const data = await insertOneObject(collection, req.body.newObject);
          res.status(200).json({ success: true, data });
        } else {
          throw new Error('400 - New object not found');
        }
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, data: errorData.message });
      }
    })
  )
);

handler.put(
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { collection } = req.query;
      const { objectId, updatedKeysAndVals } = req.body;
      try {
        if (objectId && updatedKeysAndVals) {
          const data = await updateOneObject(collection, objectId, updatedKeysAndVals);
          res.status(200).json({ success: true, data });
        } else {
          throw new Error('400');
        }
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, data: errorData.message });
      }
    })
  )
);

export default handler;
