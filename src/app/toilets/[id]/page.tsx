"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ToiletDetailsPage() {
  const { id } = useParams();
  const [toilet, setToilet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToilet() {
      if (!id) return;
      const docRef = doc(db, "toilets", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setToilet({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    }
    fetchToilet();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!toilet) return <div>Toilet not found.</div>;

  return (
    <div>
      <h1>{toilet.name}</h1>
      <p>{toilet.address}</p>
      {toilet.photoUrls && toilet.photoUrls.length > 0 && (
        <img src={toilet.photoUrls[0]} alt={toilet.name} style={{ width: 300 }} />
      )}
      {/* Render more details as needed */}
    </div>
  );
} 