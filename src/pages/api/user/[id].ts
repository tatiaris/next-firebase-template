import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { findOneObject, updateOneObject } from '@/lib/firebase';
import { authenticated, selfAuthorized } from '@/lib/auth';
import { getErrorData } from '@/lib/helper';

const collectionName = 'users';
const handler = nextConnect();

handler.get(
  authenticated(
    selfAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { id } = req.query;
      try {
        const data = await findOneObject(collectionName, id);
        res.status(200).json({ success: true, data });
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, data: errorObj.message });
      }
    })
  )
);

handler.put(
  authenticated(
    selfAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { id } = req.query;
      const { updatedKeysAndVals } = req.body;
      try {
        if (id && updatedKeysAndVals) {
          const data = await updateOneObject(collectionName, id, updatedKeysAndVals);
          res.status(200).json({ success: true, data });
        } else {
          throw new Error('406 - User not found');
        }
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, data: errorObj.message });
      }
    })
  )
);

handler.delete(
  authenticated(
    selfAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { id } = req.query;
      try {
        if (id) {
          const data = await deleteOneObject(collectionName, id);
          res.status(200).json({ success: true, data });
        } else {
          throw new Error('406 - User not found');
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
