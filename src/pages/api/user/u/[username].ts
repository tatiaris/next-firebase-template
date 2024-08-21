import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '@lib/helper';
import { findObjectById, getIdByField } from '@lib/firebase';
import { Collections } from 'src/lib/constants';
import { verifyToken } from '@lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const username = req.query.username as string;
    let isSelf = false;
    const token = req.cookies.auth;
    const id = await getIdByField(Collections.User, 'username', '==', username);

    if (!token) {
      isSelf = false;
    } else {
      try {
        const auth = (await verifyToken(token)) || {};
        const sessionId = auth['id'] as string;
        isSelf = sessionId === id;
      } catch (error) {
        isSelf = false;
      }
    }

    switch (req.method) {
      case 'GET':
        try {
          const data = await findObjectById(Collections.User, id);
          res.status(200).json({ success: true, message: 'Fetched object successfully.', data });
        } catch (error) {
          handleError(error, res);
        }
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
    }
  } catch (error) {
    handleError(error, res);
  }
}
