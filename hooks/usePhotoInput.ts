import { useState, useRef, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export interface PhotoInput {
  photoUri: string | null;
  photoBase64: string | null;
  userHint: string;
  photoFromUpload: React.MutableRefObject<boolean>;
  setPhotoUri: (uri: string | null) => void;
  setPhotoBase64: (b64: string | null) => void;
  setUserHint: (hint: string) => void;
  pickPhoto: () => Promise<void>;
  clearPhoto: () => void;
}

export function usePhotoInput(onPhotoPicked?: () => void): PhotoInput {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [userHint, setUserHint] = useState('');
  const photoFromUpload = useRef(false);

  const pickPhoto = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      setPhotoBase64(asset.base64 ?? null);
      setPhotoUri(asset.uri);
      photoFromUpload.current = true;
      onPhotoPicked?.();
    } catch {
      /* cancelled */
    }
  }, [onPhotoPicked]);

  const clearPhoto = useCallback(() => {
    setPhotoUri(null);
    setPhotoBase64(null);
    setUserHint('');
    photoFromUpload.current = false;
  }, []);

  return {
    photoUri,
    photoBase64,
    userHint,
    photoFromUpload,
    setPhotoUri,
    setPhotoBase64,
    setUserHint,
    pickPhoto,
    clearPhoto,
  };
}
