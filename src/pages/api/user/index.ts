import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorData } from '@lib/helper';
import { getAllObjects, insertOneObject } from '@lib/firebase';

const collectionName = 'users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await getAllObjects(collectionName);
      res.status(200).json({ success: true, message: '', data });
    } catch (error) {
      const errorObj = error as Error;
      const errorData = getErrorData(errorObj);
      res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
    }
  } else if (req.method === 'POST') {
    if (req.body.newObject) {
      const data = await insertOneObject(collectionName, req.body.newObject);
      res.status(200).json({ success: true, message: '', data });
    } else {
      res.status(400).json({ success: false, message: '400 - New user data missing', data: req.body });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
