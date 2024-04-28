import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorData } from '@lib/helper';
import { getAllObjects, getSampleData, insertOneObject } from '@lib/firebase';
import { adminAuthorized, authenticated } from '@lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      switch (req.method) {
        case 'GET':
          try {
            const data = await getSampleData();
            res.status(200).json({ success: true, message: `Fetched samples`, data });
          } catch (error) {
            const errorObj = error as Error;
            const errorData = getErrorData(errorObj);
            res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
          }
          break;
        default:
          res.setHeader('Allow', ['GET']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
          break;
      }
    })
  )(req, res);
}
