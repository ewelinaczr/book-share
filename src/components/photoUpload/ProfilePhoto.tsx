"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  useUploadProfilePhotoMutation,
  useGetUserPhotoQuery,
} from "@/api/userApi";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import styles from "./ProfilePhoto.module.css";

export default function ProfilePhoto() {
  const { data: session } = useSession();
  const currentUserId = session?.user.id;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadPhoto, { isLoading: isUploading }] =
    useUploadProfilePhotoMutation();
  const t = useTranslations();

  const {
    data: photoDataUrl,
    isLoading,
    isError,
    refetch,
  } = useGetUserPhotoQuery(currentUserId ?? "", { skip: !currentUserId });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!currentUserId)
    return (
      <div className={styles.photoContainer}>
        <LoadingSpinner />
      </div>
    );

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      await uploadPhoto({ userId: currentUserId, file }).unwrap();
      toast.success(t("profile_uploadSuccess"));
      refetch();
    } catch (err) {
      toast.error(t("profile_uploadError"));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.photoContainer}>
        <div className={styles.profilePhoto}>
          {isLoading ? (
            <div className={styles.imagePlaceholder} />
          ) : isError ? (
            <div className={styles.imagePlaceholder} />
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile photo"
              className={styles.image}
            />
          ) : photoDataUrl ? (
            <img
              src={photoDataUrl}
              alt="Profile photo"
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
        </div>

        <label className={styles.buttonLabel}>
          {isUploading ? t("profile_uploading") : t("profile_upload")}
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleChange}
            style={{ display: "none" }}
          />
        </label>
      </div>
    </div>
  );
}
