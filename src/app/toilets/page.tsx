"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Toilet = {
  id: string;
  name: string;
  address: string;
  photoUrls?: string[];
  features?: {
    hasSoap?: boolean;
    hasToiletPaper?: boolean;
    // add more as needed
  };
};

export default function ToiletsListPage() {
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchToilets() {
      const querySnapshot = await getDocs(collection(db, "toilets"));
      const toiletsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Toilet[];
      setToilets(toiletsData);
      setLoading(false);
    }
    fetchToilets();
  }, []);

  if (loading) return <div>Loading toilets...</div>;

  return (
    <div>
      <h1>Toilets List</h1>
      {toilets.length === 0 && <p>No toilets found.</p>}
      <ul>
        {toilets.map((toilet) => (
          <li key={toilet.id} style={{ marginBottom: 32 }}>
            <h2>{toilet.name}</h2>
            <p>{toilet.address}</p>
            {toilet.photoUrls && toilet.photoUrls.length > 0 && (
              <img
                src={toilet.photoUrls[0]}
                alt={toilet.name}
                style={{ width: 200, height: "auto" }}
              />
            )}
            <div>
              <strong>Features:</strong>
              <ul>
                <li>Soap: {toilet.features?.hasSoap ? "Yes" : "No"}</li>
                <li>Toilet Paper: {toilet.features?.hasToiletPaper ? "Yes" : "No"}</li>
                {/* Add more features as needed */}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 