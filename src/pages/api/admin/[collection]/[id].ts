import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { findOneObject, updateOneObject, deleteOneObject } from '@/lib/firebase';
import { authenticated, adminAuthorized } from '@/lib/auth';
import { getErrorData } from '@/lib/helper';

const handler = nextConnect({ attachParams: true });

handler.get(
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { id, collection } = req.query;
      try {
        const data = await findOneObject(collection, id);
        res.status(200).json({ success: true, data });
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
      const { id, collection } = req.query;
      const { updatedKeysAndVals } = req.body;
      try {
        if (id && updatedKeysAndVals) {
          const data = await updateOneObject(collection, id, updatedKeysAndVals);
          res.status(200).json({ success: true, data });
        } else {
          throw new Error('400 - Object not found');
        }
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, data: errorData.message });
      }
    })
  )
);

handler.delete(
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { id, collection } = req.query;
      try {
        if (id) {
          const data = await deleteOneObject(collection, id);
          res.status(200).json({ success: true, data });
        } else {
          throw new Error('406 - Object not found');
        }
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, data: errorObj.message });
      }
    })
  )
);

export default handler;
