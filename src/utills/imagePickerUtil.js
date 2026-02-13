import ImagePicker from 'react-native-image-crop-picker';
import {Alert, Platform} from 'react-native';

/**
 * Global Image Picker Utility using react-native-image-crop-picker
 * - Works on Android (<=12 and >12) and iOS
 * - Normalizes response so existing code (Cloudinary upload etc.) keeps working
 */

const defaultPickerOptions = {
  mediaType: 'photo',
  cropping: false,
  multiple: false,
  compressImageQuality: 0.8,
};

const normalizeImage = image => {
  if (!image) {
    return null;
  }

  const path = image.path || image.sourceURL || image.uri;

  return {
    // What the rest of the app expects
    uri:
      Platform.OS === 'android'
        ? path
        : path?.startsWith('file://')
        ? path
        : `file://${path}`,
    type: image.mime || 'image/jpeg',
    fileName: image.filename || 'image.jpg',

    // Extra data (not always used but handy to have)
    width: image.width,
    height: image.height,
    size: image.size,
    path,
    mime: image.mime,
  };
};

/**
 * Pick single image from gallery
 * @param {Object} customOptions - Overrides for picker options
 * @returns {Promise<Object|null>} normalized image object or null if cancelled
 */
export const pickImageFromLibrary = async (customOptions = {}) => {
  try {
    const options = {
      ...defaultPickerOptions,
      multiple: false,
      ...customOptions,
    };

    const image = await ImagePicker.openPicker(options);

    // When multiple=true, library can still return array; guard for that
    const firstImage = Array.isArray(image) ? image[0] : image;
    return normalizeImage(firstImage);
  } catch (error) {
    // User cancelled
    if (error?.code === 'E_PICKER_CANCELLED') {
      return null;
    }

    console.log('pickImageFromLibrary error:', error);
    Alert.alert('Error', 'Failed to pick image. Please try again.');
    throw error;
  }
};

/**
 * Pick multiple images from gallery
 * @param {number} limit - Max number of images (handled in UI, library itself is unlimited)
 * @param {Object} customOptions
 * @returns {Promise<Array>} normalized image objects array
 */
export const pickMultipleImagesFromLibrary = async (
  limit = 5,
  customOptions = {},
) => {
  try {
    const options = {
      ...defaultPickerOptions,
      multiple: true,
      ...customOptions,
    };

    const images = await ImagePicker.openPicker(options);
    if (!images) {
      return [];
    }

    const array = Array.isArray(images) ? images : [images];
    const normalized = array.map(normalizeImage).filter(Boolean);

    if (limit && normalized.length > limit) {
      return normalized.slice(0, limit);
    }

    return normalized;
  } catch (error) {
    if (error?.code === 'E_PICKER_CANCELLED') {
      return [];
    }

    console.log('pickMultipleImagesFromLibrary error:', error);
    Alert.alert('Error', 'Failed to pick images. Please try again.');
    throw error;
  }
};

/**
 * Simple availability flag – if JS module is loaded, we assume it's available.
 * Real native issues will surface during actual use.
 */
export const isImagePickerAvailable = () => {
  return !!ImagePicker;
};

export default {
  pickImageFromLibrary,
  pickMultipleImagesFromLibrary,
  isImagePickerAvailable,
};
