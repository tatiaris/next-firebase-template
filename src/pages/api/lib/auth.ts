import { decode, verify } from 'jsonwebtoken';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { findOneObject } from '@lib/firebase';

const isAdmin = async (auth: string) => {
  const decoded = decode(auth);
  const adminObject = await findOneObject('admin', decoded['id']);
  return adminObject ? adminObject.admin : false;
};

const isSelf = (auth: string, id: string) => {
  const decoded = decode(auth);
  return decoded['id'] === id;
};

export const authenticated = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  verify(req.cookies.auth, process.env.AUTH_TOKEN, async function (err, decoded) {
    if (!err && decoded) {
      fn(req, res);
    } else {
      res.status(401).json({ success: false, data: 'You are not authenticated' });
    }
  });
};

export const adminAuthorized = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const hasAdminAccess = await isAdmin(req.cookies.auth);
  if (hasAdminAccess) {
    fn(req, res);
  } else {
    res.status(403).json({ success: false, data: 'You are not authorized' });
  }
};

export const selfAuthorized = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (isSelf(req.cookies.auth, id as string)) {
    fn(req, res);
  } else {
    res.status(403).json({ success: false, data: 'You are not authorized' });
  }
};
