"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type GalleryPhoto = {
  slot: string;
  src: string;
  alt: string;
  title: string;
  label: string;
};

export default function ProjectGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const activePhoto = selected === null ? null : photos[selected];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
  }, [selected]);

  function close() {
    dialogRef.current?.close();
  }

  return <>
    <div className="gallery-grid">
      {photos.map((photo, index) => <figure className={`gallery-item gallery-item-${index + 1} reveal-delay-${index % 3}`} data-reveal key={photo.slot}>
        <Image src={photo.src} alt={photo.alt} fill sizes={index === 0 ? "(max-width: 700px) 100vw, 56vw" : "(max-width: 700px) 100vw, 38vw"} />
        <figcaption><span>0{index + 1} / {photo.label}</span><strong>{photo.title}</strong></figcaption>
        <button type="button" className="gallery-trigger" aria-label={`Agrandir : ${photo.title}`} onClick={() => setSelected(index)}>
          <span className="gallery-zoom-icon" aria-hidden="true"><Maximize2 size={19} /></span>
        </button>
      </figure>)}
    </div>
    <dialog
      ref={dialogRef}
      className="gallery-lightbox"
      aria-label={activePhoto ? `Photo agrandie : ${activePhoto.title}` : "Photo agrandie"}
      onClose={() => setSelected(null)}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      {activePhoto && <div className="gallery-lightbox-inner">
        <div className="gallery-lightbox-bar">
          <div><span>{activePhoto.label}</span><strong>{activePhoto.title}</strong></div>
          <button type="button" ref={closeRef} className="gallery-lightbox-close" onClick={close} aria-label="Fermer la photo"><X size={24} /></button>
        </div>
        <div className="gallery-lightbox-image"><Image src={activePhoto.src} alt={activePhoto.alt} fill sizes="100vw" style={{ objectFit: "contain" }} /></div>
      </div>}
    </dialog>
  </>;
}
