import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Fetch(props) {
  const [center, setCenter] = useState([]);
  const coordinatesCollectionRef = collection(db, "coordinates");

  useEffect(() => {
    const getCenter = async () => {
      const coordinatesSnapshot = await getDocs(coordinatesCollectionRef);
      const coordinatesList = coordinatesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCenter(coordinatesList);
    };

    getCenter();
  }, []);

  return (
    <div>
      {center}
    </div>
  );
}
