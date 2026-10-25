import { useState } from "react";
import CarArt from "./CarArt";

const PHOTOS = [
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
];

export default function VehicleImage({
  identity = "",
  hero = false,
}) {
  const [failed, setFailed] = useState(false);

  const hash = Array.from(identity).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );

  const selected = hero ? PHOTOS[1] : PHOTOS[hash % PHOTOS.length];
  const src = `${selected}?auto=format&fit=crop&w=${hero ? 1200 : 800}&q=80`;

  return (
    <div className={`photo-frame ${hero ? "photo-frame-hero" : ""}`}>
      {failed ? (
        <CarArt className="photo-fallback" />
      ) : (
        <img
          src={src}
          alt="Representative car photograph, not the listed inventory vehicle"
          className="vehicle-photo"
          width={hero ? 1200 : 800}
          height={hero ? 650 : 450}
          loading={hero ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
