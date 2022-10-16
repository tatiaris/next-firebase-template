import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { findOneObject, updateOneObject, deleteOneObject } from '@/lib/firebase';
import { authenticated, adminAuthorized } from '@/lib/auth';
import { getErrorData } from '@/lib/helper';

export type adminQuery = {
  id: string,
  collection: string
}

const handler = nextConnect({ attachParams: true });

handler.get(
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { id, collection } = req.query as adminQuery;
      try {
        const data = await findOneObject(collection, id);
        res.status(200).json({ success: true, message: `Found ${id} in ${collection}`, data });
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
      }
    })
  )
);

handler.put(
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { id, collection } = req.query as adminQuery;
      const { updatedKeysAndVals } = req.body;
      try {
        if (id && updatedKeysAndVals) {
          const data = await updateOneObject(collection, id, updatedKeysAndVals);
          res.status(200).json({ success: true, message: `Updated ${id} in ${collection}`, data });
        } else {
          throw new Error('400 - Object not found');
        }
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
      }
    })
  )
);

handler.delete(
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { id, collection } = req.query as adminQuery;
      try {
        if (id) {
          const data = await deleteOneObject(collection, id);
          res.status(200).json({ success: true, message: `Deleted ${id} from ${collection}`, data });
        } else {
          throw new Error('406 - Object not found');
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
