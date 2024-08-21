import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorData } from '@lib/helper';
import { authenticated, deleteSessionCookies } from '@lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    authenticated(async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        deleteSessionCookies(res);
        res.status(200).json({ success: true, data: 'See ya later!' });
      } catch (error) {
        const errorObj = error as Error;
        const errorData = getErrorData(errorObj);
        res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
      }
    })(req, res);
  } else {
    res.status(400).json({ success: false, message: 'Bad Request', data: {} });
  }
}
