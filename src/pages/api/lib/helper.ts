import { addObjectToCollection, findObjectByFilter } from './firebase';
import { Collections } from 'src/lib/constants';
import { Timestamp } from '@google-cloud/firestore';
import { firestore } from 'firebase-admin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataFunction = (...params: any[]) => Promise<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const awaitData = async (func: DataFunction, ...params: any[]) => {
  try {
    const response = await func(...params);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleError = (error, res) => {
  const errorObj = error as Error;
  const errorData = getErrorData(errorObj);
  if (errorData.code === 500) {
    console.error('handleError:', error);
    if (process.env.NODE_ENV === 'production') {
      addObjectToCollection('errors', {
        name: errorObj.name,
        message: errorObj.message,
        stack: errorObj.stack,
        cause: errorObj.cause,
        timestamp: Timestamp.now()
      });
    }
  }
  res.status(errorData.code).json({ success: false, message: errorData.message, data: errorObj });
};

export const getErrorData = (error) => {
  try {
    const errMessageSplit = error.message.split(' - ');
    const code = parseInt(errMessageSplit[0]) || 500;
    const message = errMessageSplit[1];
    return { code, message };
  } catch (error) {
    return { code: 500, message: 'Something went wrong on our side!' };
  }
};

export const isUsernameTaken = async (username: string): Promise<boolean> => {
  if (!username || username.length < 1 || username === 'deleted_user') return true;
  const [user] = await awaitData(findObjectByFilter, Collections.User, 'username', '==', username);
  return user !== null;
};

// Helper function to select highest quality image
function selectHighestQualityImage(images: string[]) {
  return images && images.length ? images[0] : null;
}

// Helper function to select highest quality icon
function selectHighestQualityIcon(icons: string[]) {
  return icons && icons.length ? icons[0] : null;
}

function getIconFullUrl(url, icon) {
  // Check if the icon URL is already a full URL
  if (icon.startsWith('http')) return icon;
  if (icon.startsWith('//')) return 'https:' + icon;

  // Parse the base URL
  const urlObj = new URL(url);

  // Handle absolute path
  if (icon.startsWith('/')) {
    return urlObj.origin + icon;
  }

  // If icon is a relative path, use only the origin of the base URL
  return urlObj.origin + '/' + icon;
}

export const replaceHttpWithHttps = (url: string): string => {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

export const deleteUser = async (userId: string) => {
  const userRef = firestore().collection(Collections.User).doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) return;

  const batch = firestore().batch();

  const deleteSubcollections = async (docRef: FirebaseFirestore.DocumentReference) => {
    const subcollections = await docRef.listCollections();
    for (const subcollection of subcollections) {
      const subcollectionSnapshot = await subcollection.get();
      for (const doc of subcollectionSnapshot.docs) {
        await deleteSubcollections(doc.ref); // Recursively delete subcollections of subcollections
        batch.delete(doc.ref);
      }
    }
  };

  try {
    // Remove the user from other users' follower and following lists
    const [followersSnapshot, followingSnapshot] = await Promise.all([firestore().collection(`users/${userId}/followers`).get(), firestore().collection(`users/${userId}/following`).get()]);

    followersSnapshot.forEach((doc) => {
      const followingRef = firestore().collection(`users/${doc.id}/following`).doc(userId);
      batch.delete(followingRef);
    });

    followingSnapshot.forEach((doc) => {
      const followersRef = firestore().collection(`users/${doc.id}/followers`).doc(userId);
      batch.delete(followersRef);
    });

    // Delete all nested subcollections of the user document
    await deleteSubcollections(userRef);

    // Delete the follower and following subcollections of the user
    await Promise.all([deleteSubcollections(firestore().collection(`users/${userId}/followers`).doc()), deleteSubcollections(firestore().collection(`users/${userId}/following`).doc())]);

    // Delete the user document itself
    batch.delete(userRef);

    // Commit the batch
    await batch.commit();
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error; // Re-throw error to handle it in the calling function if needed
  }
};
