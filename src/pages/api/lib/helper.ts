import { sign } from 'jsonwebtoken';
import cookie from 'cookie';
import { sessionCookieAge } from '@/lib/constants';

export const getErrorData = (error) => {
  try {
    const errMessageSplit = error.message.split(' - ');
    const code = parseInt(errMessageSplit[0]);
    const message = errMessageSplit[1];
    return { code, message };
  } catch (error) {
    return { code: 500, message: 'Something went wrong on our side!' };
  }
};

export const setSessionCookies = (res, id, user) => {
  const auth = sign({ id }, process.env.AUTH_TOKEN);
  const udata = sign({ user }, process.env.AUTH_TOKEN);
  const expiryDate = new Date(Date.now() + sessionCookieAge);
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

export const deleteSessionCookies = (res) => {
  res.setHeader('Set-Cookie', [
    cookie.serialize('auth', null, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/'
    }),
    cookie.serialize('udata', null, {
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/'
    })
  ]);
};
