import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorData, deleteSessionCookies } from '@lib/helper';
import { verify } from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    verify(req.cookies.auth, process.env.AUTH_TOKEN, function (err, decoded) {
      if (!err && decoded) {
        try {
          deleteSessionCookies(res);
          res.status(200).json({ success: true, data: 'See ya later!' });
        } catch (error) {
          const errorObj = error as Error;
          const errorData = getErrorData(errorObj);
          res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
        }
      } else {
        res.status(401).json({ success: false, data: 'You are not authenticated' });
      }
    });
  } else {
    res.status(400).json({ success: false, message: "Bad Request", data: {} });
  }
}
