import { compare } from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorData, setSessionCookies } from '@lib/helper';
import { findOneObject, getDocId } from '@lib/firebase';

const collectionName = 'users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
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
            await compare(saltPepperPassword, userAuth.password, function (err, result) {
              if (!err && result) {
                setSessionCookies(res, userId, existingUser);
                res.json({ success: true, message: 'Welcome back!', data: existingUser });
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
  } else {
    res.status(400).json({ success: false, message: "Bad Request", data: {} });
  }
}
