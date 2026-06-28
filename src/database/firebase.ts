/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
};

export const FirebaseService = {
  app: getApps().length === 0 ? initializeApp(firebaseConfig) : getApp(),
  
  get storage() {
    return getStorage(this.app);
  },
  
  get firestore() {
    return getFirestore(this.app);
  },

  /**
   * Uploads a user resume or accessibility document to Firebase Storage
   */
  async uploadDocument(userId: string, file: File, onProgress?: (progress: number) => void): Promise<string> {
    const storageRef = ref(this.storage, `users/${userId}/resumes/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on("state_changed", 
        (snapshot) => {
          if (onProgress) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          }
        }, 
        (error) => reject(error), 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  },

  /**
   * Generates a Firebase Dynamic Link for sharing a job posting
   */
  async generateDynamicJobLink(jobId: string) {
    // Requires Firebase Dynamic Links REST API or third party integration
    console.log(`[Firebase] Generating dynamic share link for job ${jobId}`);
    return `https://kairos.page.link/job?id=${jobId}`;
  },

  /**
   * Saves file metadata (timestamps, linked user IDs) to Firestore
   */
  async saveFileMetadata(userId: string, fileUrl: string, metadata: any) {
    const docRef = doc(this.firestore, `users/${userId}/files/${Date.now()}`);
    await setDoc(docRef, { url: fileUrl, ...metadata, createdAt: new Date().toISOString() });
    return true;
  }
};
