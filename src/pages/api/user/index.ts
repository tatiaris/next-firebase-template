import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getErrorData } from '@/lib/helper';
import { getAllObjects, insertOneObject, updateOneObject } from '@/lib/firebase';

const collectionName = 'users';
const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await getAllObjects(collectionName);
    res.status(200).json({ success: true, message: '', data });
  } catch (error) {
    const errorObj = error as Error;
    const errorData = getErrorData(errorObj);
    res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
  }
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.body.newObject) {
      const data = await insertOneObject(collectionName, req.body.newObject);
      res.status(200).json({ success: true, message: '', data });
    } else {
      throw new Error('400 - New user data missing');
    }
  } catch (error) {
    const errorObj = error as Error;
    const errorData = getErrorData(errorObj);
    res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
  }
});

export default handler;
