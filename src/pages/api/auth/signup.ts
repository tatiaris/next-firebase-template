import { hash } from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getErrorData, setSessionCookies } from '@/lib/helper';
import { findOneObject, insertOneObject } from '@/lib/firebase';

const collectionName = 'users';
const handler = nextConnect();

export type NewUser = {
  email: string;
  displayName: string;
  photoURL?: string;
};

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.body.newUser && req.body.password) {
      const newUser = req.body.newUser as NewUser;
      const rawPassword = req.body.password;
      const existingUser = await findOneObject(collectionName, null, ['email', '==', newUser.email]);
      if (existingUser) {
        throw new Error('406 - User already exists');
      } else {
        const saltPepperPassword = rawPassword + newUser.email + process.env.AUTH_SECRET_KEY;
        hash(saltPepperPassword, 10, async function (err, hash) {
          const resId = await insertOneObject(collectionName, newUser);
          await insertOneObject('auth', { password: hash }, resId);
          setSessionCookies(res, resId, newUser);
          res.status(200).json({ success: true });
        });
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
