import { NextApiRequest, NextApiResponse } from 'next';
import { authenticated, adminAuthorized } from '@lib/auth';
import { getErrorData, handleError } from '@lib/helper';
import { deleteDocById, findObjectById, updateObjectById } from '@lib/firebase';

export type adminQuery = {
  id: string;
  collection: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      const { id, collection } = req.query as adminQuery;
      const { updatedKeysAndVals } = req.body;
      switch (req.method) {
        case 'GET':
          try {
            const data = await findObjectById(collection, id);
            res.status(200).json({ success: true, message: `Found ${id} in ${collection}`, data });
          } catch (error) {
            handleError(error, res);
          }
          break;
        case 'PUT':
          try {
            if (id && updatedKeysAndVals) {
              const data = await updateObjectById(collection, id, updatedKeysAndVals);
              res.status(200).json({ success: true, message: `Updated ${id} in ${collection}`, data });
            } else {
              throw new Error('400 - Object not found');
            }
          } catch (error) {
            handleError(error, res);
          }
          break;
        case 'DELETE':
          try {
            if (id) {
              const data = await deleteDocById(collection, id);
              res.status(200).json({ success: true, message: `Deleted ${id} from ${collection}`, data });
            } else {
              throw new Error('406 - Object not found');
            }
          } catch (error) {
            handleError(error, res);
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
