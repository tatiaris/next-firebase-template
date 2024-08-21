import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUserData, handleError } from '@lib/helper';
import { authenticated } from '@lib/auth';
import { decode } from 'jsonwebtoken';

export default authenticated(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = decode(req.cookies.auth) || {};
    const id = auth['id'] as string;

    if (!id) {
      res.status(401).json({ success: false, message: 'Authentication token is invalid' });
      return;
    }

    switch (req.method) {
      case 'GET':
        try {
          const data = await getAllUserData(id, true);
          res.status(200).json({ success: true, message: 'Fetched data successfully.', data });
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
});
