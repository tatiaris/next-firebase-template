import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { decode } from 'jsonwebtoken';
import { findOneObject } from '@/lib/firebase';

const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = decode(req.cookies.auth);
    const user = await findOneObject('users', auth['id']);
    res.status(200).json({ success: true, session: user });
  } catch (error) {
    res.status(200).json({ success: true, session: null });
  }
});

export default handler;
