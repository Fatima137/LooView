// src/lib/firestore.ts

import { db } from '../firebase'; // Import the db instance
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  runTransaction,
} from 'firebase/firestore';
import { Toilet } from './types'; // Import the Toilet interface

// Function to add a new toilet and update user's total count
export const addToilet = async (
  toiletData: Omit<Toilet, 'createdAt' | 'averageRating' | 'reviewCount' | 'status' | 'lastVerifiedAt' | 'isPublic'>,
  userId: string // Pass the user ID to link the toilet and update the user
): Promise<string | undefined> => {
  if (!userId) {
    console.error('User ID is required to add a toilet.');
    throw new Error('User not authenticated.');
  }

  const toiletsCollectionRef = collection(db, 'toilets');
  const userDocRef = doc(db, 'users', userId);

  try {
    // Use a transaction for atomic updates: add toilet and update user count
    const newToiletRef = await runTransaction(db, async (transaction) => {
      // Add the new toilet document
      const toiletToAdd = {
        ...toiletData,
        createdAt: serverTimestamp(), // Use server timestamp
        addedBy: userId, // Link to the user
        // Initialize optional fields if not provided in input
        averageRating: 0, // Start with 0 or handle initial rating differently
        reviewCount: 0,
        status: 'active', // Default status
        // lastVerifiedAt is optional
        isPublic: true, // Default public status
      };

      const docRef = await addDoc(toiletsCollectionRef, toiletToAdd);

      // Increment the user's totalToiletsAdded count
      transaction.update(userDocRef, {
        totalToiletsAdded: increment(1),
      });

      return docRef; // Return the reference to the newly added toilet document
    });

    console.log('New toilet added with ID:', newToiletRef.id);
    return newToiletRef.id; // Return the ID of the new document

  } catch (error) {
    console.error('Error adding toilet and updating user:', error);
    // Handle specific errors if needed (e.g., permission denied)
    throw error; // Rethrow the error for the calling component to handle
  }
};

// Add other Firestore interaction functions here later
// e.g., getToilets, getReviewsForToilet, etc.