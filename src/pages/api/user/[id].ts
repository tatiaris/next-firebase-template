import { NextApiRequest, NextApiResponse } from 'next';
import { findOneObject, updateOneObject, deleteOneObject } from '@lib/firebase';
import { authenticated, selfAuthorized } from '@lib/auth';
import { getErrorData } from '@lib/helper';
import { Collections } from '@lib/constants';

const collectionName = Collections.User;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticated(
    selfAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const id = req.query.id as string;
      const { updatedKeysAndVals } = req.body;
      switch (req.method) {
        case 'GET':
          try {
            const data = await findOneObject(collectionName, id);
            res.status(200).json({ success: true, message: 'Fetched object successfully.', data });
          } catch (error) {
            const errorObj = error as Error;
            const errorData = getErrorData(errorObj);
            res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
          }
          break;
        case 'PUT':
          try {
            if (id && updatedKeysAndVals) {
              const data = await updateOneObject(collectionName, id, updatedKeysAndVals);
              res.status(200).json({ success: true, message: 'Updated object successfully.', data });
            } else {
              throw new Error('406 - Object not found');
            }
          } catch (error) {
            const errorObj = error as Error;
            const errorData = getErrorData(errorObj);
            res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
          }
          break;
        case 'DELETE':
          try {
            if (id) {
              const data = await deleteOneObject(collectionName, id);
              res.status(200).json({ success: true, message: 'Deleted object successfully.', data });
            } else {
              throw new Error('406 - Object not found');
            }
          } catch (error) {
            const errorObj = error as Error;
            const errorData = getErrorData(errorObj);
            res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
          }
          break;
        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
          break;
      }
    })
  )(req, res);
}
