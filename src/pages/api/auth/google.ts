import { NextApiRequest, NextApiResponse } from 'next';
import { handleError, isUsernameTaken } from '@lib/helper';
import { Collections } from 'src/lib/constants';
import { addObjectWithId, findObjectByFilter, findObjectById } from '@lib/firebase';
import { UserObjectDB } from 'src/lib/types';
import { setSessionCookies } from '@lib/auth';
import admin from 'firebase-admin';
import { sign } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { user, credential } = req.body;

      if (!user || !credential) {
        throw new Error('400 - Missing user data or credential');
      }

      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(credential.idToken);
      const uid = decodedToken.uid;

      // Ensure the user in the request matches the token UID
      if (uid !== user.uid) {
        throw new Error('401 - Token UID does not match user UID');
      }

      const existingUser = (await findObjectByFilter(Collections.User, 'email', '==', user.email)) as UserObjectDB;
      if (existingUser) {
        const isAdmin = await findObjectById(Collections.Admin, existingUser.id);
        if (isAdmin) {
          existingUser['isAdmin'] = true;
        }
        setSessionCookies(res, existingUser.id, existingUser);
        res.json({
          success: true,
          data: 'Welcome back!',
          authToken: sign({ id: existingUser.id }, process.env.AUTH_TOKEN)
        });
      } else {
        const name = user.displayName ? (user.displayName as string).toLowerCase() : generateRandomName();
        let usernameTaken = await isUsernameTaken(user.email.split('@')[0]);
        let i = 1;
        if (usernameTaken) {
          while (usernameTaken) {
            usernameTaken = await isUsernameTaken(`${user.email.split('@')[0]}${i}`);
            i++;
          }
        }
        const username = ((usernameTaken ? `${user.email.split('@')[0]}${i}` : user.email.split('@')[0]) as string).toLowerCase();
        const picture = user.photoURL ? user.photoURL : 'https://rekk.it/placeholders/user.jpg';

        const newUser = { email: user.email, name, username, picture };
        const resId = await addObjectWithId(Collections.User, newUser);
        setSessionCookies(res, resId, { ...newUser, id: resId });
        res.status(200).json({
          success: true,
          data: 'Welcome to Rekk.it!',
          authToken: sign({ id: resId }, process.env.AUTH_TOKEN)
        });
      }
    } catch (error) {
      handleError(error, res);
    }
  } else {
    res.status(400).json({ success: false, message: 'Bad Request', data: {} });
  }
}

const generateRandomName = () => {
  const adjectives = ['happy', 'sad', 'angry', 'excited', 'bored', 'sleepy', 'hungry', 'thirsty', 'silly', 'crazy'];
  const nouns = ['cat', 'dog', 'bird', 'fish', 'hamster', 'rabbit', 'turtle', 'lizard', 'snake', 'parrot'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
};
