import { NextApiRequest, NextApiResponse } from 'next';
import { authenticated, selfAuthorized } from '@lib/auth';
import { deleteUser, handleError, isUsernameTaken } from '@lib/helper';
import { Collections } from 'src/lib/constants';
import { findObjectById } from '@util/firebase';
import { updateOrAddObjectById } from '@lib/firebase';
import { Timestamp } from '@google-cloud/firestore';

const collectionName = Collections.User;

export default authenticated(
  selfAuthorized(async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id as string;
    const { updatedKeysAndVals } = req.body;

    try {
      switch (req.method) {
        case 'GET': {
          const data = await findObjectById(collectionName, id);
          res.status(200).json({ success: true, message: 'Fetched object successfully.', data });
          break;
        }
        case 'PUT': {
          if (id && updatedKeysAndVals) {
            if (updatedKeysAndVals.id) delete updatedKeysAndVals.id;
            if ('username' in updatedKeysAndVals) {
              if (typeof updatedKeysAndVals.username !== 'string') {
                throw new Error('400 - Username must be a string');
              }
              // check if it has been 30 days since the last username update
              const lastUsernameUpdate = (await findObjectById(`${Collections.User}/${id}/track`, 'lastUsernameUpdate')) as { timestamp: Timestamp };
              if (lastUsernameUpdate && lastUsernameUpdate.timestamp) {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                if (lastUsernameUpdate.timestamp.toDate() > thirtyDaysAgo) {
                  throw new Error('403 - Username can only be updated once every 30 days');
                }
              }
              // check if username is already taken
              updatedKeysAndVals.username = updatedKeysAndVals.username.toLowerCase();
              const usernameAlreadyTaken = await isUsernameTaken(updatedKeysAndVals.username);
              if (usernameAlreadyTaken) {
                throw new Error('409 - Username already taken');
              } else {
                await updateOrAddObjectById(`${Collections.User}/${id}/track`, 'lastUsernameUpdate', { timestamp: Timestamp.now() });
              }
            }
            const updatedData = await updateOrAddObjectById(collectionName, id, updatedKeysAndVals);
            res.status(200).json({ success: true, message: 'Updated object successfully.', data: updatedData });
          } else {
            throw new Error('406 - Object not found');
          }
          break;
        }
        case 'DELETE': {
          if (id) {
            await deleteUser(id);
            res.status(200).json({ success: true, message: 'Deleted object successfully.', data: null });
          } else {
            throw new Error('406 - Object not found');
          }
          break;
        }
        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
          break;
      }
    } catch (error) {
      handleError(error, res);
    }
  })
);
