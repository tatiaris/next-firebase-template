import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getErrorData, deleteSessionCookies } from '@/lib/helper';
import { authenticated } from '@/lib/auth';

const handler = nextConnect();

handler.post(
  authenticated(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      deleteSessionCookies(res);
      console.log('deleted session cookies');
      res.status(200).json({ success: true, data: 'See ya later!' });
    } catch (error) {
      console.log('failed log out', error);
      const errorObj = error as Error;
      const errorData = getErrorData(errorObj);
      res.status(errorData.code).json({ success: false, data: errorData.message });
    }
  })
);

export default handler;
