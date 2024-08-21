import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorData } from '@lib/helper';
import { Collections } from 'src/lib/constants';
import { getCollection } from '@lib/firebase';
import { UserObjectDB } from 'src/lib/types';
import { DocumentData, QuerySnapshot } from '@google-cloud/firestore';

const collectionName = Collections.User;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const usersSnapshot = (await getCollection(Collections.User)) as QuerySnapshot<DocumentData>;
      const promises = usersSnapshot.docs.map(async (doc) => {
        const user = doc.data() as UserObjectDB;
        return user.username;
      });
      const data = (await Promise.all(promises)).filter((username) => username !== 'anonymous');
      res.status(200).json({ success: true, message: '', data });
    } catch (error) {
      const errorObj = error as Error;
      const errorData = getErrorData(errorObj);
      res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
