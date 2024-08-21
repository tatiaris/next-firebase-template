import { NextApiRequest, NextApiResponse } from 'next';
import { authenticated, adminAuthorized } from '@lib/auth';
import { handleError } from '@lib/helper';
import { findObjectById, getCollection } from '@lib/firebase';
import { UserObjectDB } from 'src/lib/types';
import { Collections } from 'src/lib/constants';
import { Timestamp } from '@google-cloud/firestore';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticated(
    adminAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
      if (req.method === 'GET') {
        try {
          const collectionSnapshot = await getCollection(Collections.User);
          const data = await Promise.all(
            collectionSnapshot.docs.map(async (doc) => {
              const userData = doc.data() as UserObjectDB & { lastSessionRefresh?: Timestamp };
              const lastSessionRefresh = (await findObjectById(`${Collections.User}/${userData.id}/track`, 'lastSessionRefresh')) as { timestamp: Timestamp };
              if (lastSessionRefresh) userData.lastSessionRefresh = lastSessionRefresh.timestamp;
              return userData;
            })
          );
          res.status(200).json({ success: true, message: 'Success', data });
        } catch (error) {
          handleError(error, res);
        }
      } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    })
  )(req, res);
};

export default handler;
