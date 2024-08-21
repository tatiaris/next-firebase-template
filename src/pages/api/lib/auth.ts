import { decode, sign, verify } from 'jsonwebtoken';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import { getErrorData } from './helper';
import { Collections } from 'src/lib/constants';
import { findObjectById, updateOrAddObjectById } from './firebase';

export const authenticated =
  (fn: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies.auth;
      if (!token) {
        return res.status(401).json({ success: false, message: 'You are not authenticated' });
      }

      const decoded = await verifyToken(token);
      if (decoded) {
        (req as any).user = decoded;
        return await fn(req, res);
      } else {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Authentication failed', error: error.message });
    }
  };

export const adminAuthorized =
  (fn: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies.auth;
      if (!token) {
        return res.status(403).json({ success: false, message: 'You are not authorized' });
      }

      const hasAdminAccess = await isAdmin(token);
      if (hasAdminAccess) {
        return await fn(req, res);
      } else {
        return res.status(403).json({ success: false, message: 'You are not authorized' });
      }
    } catch (error) {
      const errorData = getErrorData(error as Error);
      return res.status(errorData.code).json({ success: false, message: errorData.message, error: error.message });
    }
  };

export const selfAuthorized =
  (fn: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    try {
      const token = req.cookies.auth;
      if (!token) {
        return res.status(403).json({ success: false, message: 'You are not authorized' });
      }

      const authorized = isSelf(token, id as string) || (await isAdmin(token));
      if (authorized) {
        return await fn(req, res);
      } else {
        return res.status(403).json({ success: false, message: 'You are not authorized' });
      }
    } catch (error) {
      return res.status(403).json({ success: false, message: 'Authorization failed', error: error.message });
    }
  };

export const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    verify(token, process.env.AUTH_TOKEN, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

export const isAdmin = async (auth: string): Promise<boolean> => {
  const decoded = decode(auth) as { id: string };
  const adminObject = (await findObjectById(Collections.Admin, decoded.id)) as { admin: boolean };
  return adminObject ? adminObject.admin : false;
};

export const isSelf = (auth: string, id: string): boolean => {
  const decoded = decode(auth) as { id: string };
  return decoded.id === id;
};

export const setSessionCookies = (res: NextApiResponse, id: string, user: any): void => {
  const auth = sign({ id }, process.env.AUTH_TOKEN);
  const udata = sign({ user }, process.env.AUTH_TOKEN);
  const expiryDate = new Date(Date.now() + parseInt(process.env.SESSION_COOKIE_AGE));
  updateOrAddObjectById(`${Collections.User}/${id}/track`, 'lastSessionRefresh', { timestamp: new Date() });

  res.setHeader('Set-Cookie', [
    cookie.serialize('auth', auth, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: expiryDate,
      sameSite: 'strict',
      path: '/'
    }),
    cookie.serialize('udata', udata, {
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development',
      expires: expiryDate,
      sameSite: 'strict',
      path: '/'
    })
  ]);
};

export const deleteSessionCookies = (res: NextApiResponse): void => {
  res.setHeader('Set-Cookie', [
    cookie.serialize('auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      sameSite: 'strict',
      path: '/'
    }),
    cookie.serialize('udata', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      sameSite: 'strict',
      path: '/'
    })
  ]);
};
