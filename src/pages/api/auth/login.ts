import { compare } from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getErrorData, setSessionCookies } from '@/lib/helper';
import { findOneObject, getDocId } from '@/lib/firebase';

const collectionName = 'users';
const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const rawPassword = req.body.password;
      const existingUser = await findOneObject(collectionName, null, ['email', '==', email]);
      if (existingUser) {
        const userId = await getDocId(collectionName, ['email', '==', existingUser.email]);
        const userAuth = await findOneObject('auth', userId);
        if (userAuth) {
          const saltPepperPassword = rawPassword + existingUser.email + process.env.AUTH_SECRET_KEY;
          compare(saltPepperPassword, userAuth.password, function (err, result) {
            if (!err && result) {
              setSessionCookies(res, userId, existingUser);
              res.json({ success: true, data: 'Welcome back!' });
            } else {
              throw new Error('401 - Wrong email or password');
            }
          });
        } else {
          throw new Error('406 - User not found');
        }
      } else {
        throw new Error('401 - Wrong email or password');
      }
    } else {
      throw new Error('400 - Missing email or password');
    }
  } catch (error) {
    const errorObj = error as Error;
    const errorData = getErrorData(errorObj);
    res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
  }
});

export default handler;
