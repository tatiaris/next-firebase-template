import { hash } from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getErrorData, setSessionCookies } from '@/lib/helper';
import { findOneObject, insertOneObject } from '@/lib/firebase';

const collectionName = 'users';
const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const googleUser = req.body.newUser;
    if (googleUser) {
      const existingUser = await findOneObject(collectionName, null, ['email', '==', googleUser.email]);
      if (existingUser) {
        setSessionCookies(res, existingUser.id, existingUser);
        res.json({ success: true, data: 'Welcome back!' });
      } else {
        const newUser = {
          displayName: googleUser.displayName,
          email: googleUser.email,
          photoURL: googleUser.photoURL
        };
        const resId = await insertOneObject(collectionName, newUser);
        setSessionCookies(res, resId, newUser);
        res.status(200).json({ success: true });
      }
    } else {
      throw new Error('400 - Missing user data or password');
    }
  } catch (error) {
    const errorObj = error as Error;
    const errorData = getErrorData(errorObj);
    res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
  }
});

export default handler;
