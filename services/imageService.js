    
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';
import { supabaseUrl } from '../components';

export const getUserImageSrc = (imagePath) => {
    if (imagePath) {
      const fileUrl = getSupabaseFileUrl(imagePath);
      return fileUrl;
    } else {
      return require('../assets/images/defaultUser.png');
    }
  };
  
  export const getSupabaseFileUrl = (filePath) => {
    if (filePath) {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`;
      return { uri: publicUrl };
    }
    console.warn('File path is null or invalid'); 
    return null;
  };
  
 

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    const fileName = getFilePath(folderName, isImage);

   
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
   
    const imageData = decode(fileBase64); 
   
    const { data, error } = await supabase.storage.from('uploads').upload(fileName, imageData, {
      cacheControl: '3600',
      upsert: false,
      contentType: isImage ? 'image/jpeg' : 'video/mp4', 
    });

    if (error) {
      console.error('File Upload Error:', error.message);
      return { success: false, msg: 'Could not upload the media' };
    }

    return { success: true, data: data.path };
  } catch (error) {
    console.error('Unexpected Error in File Upload:', error.message);
    return { success: false, msg: 'Could not upload the media' };
  }
};

export const getFilePath = (folderName, isImage) => {
  return `${folderName}/${Date.now()}${isImage ? '.jpg' : '.mp4'}`;
};


export  const downloadFile = async (url) => {
       try {
        const {uri} = await FileSystem.downloadAsync(url, getLocalFilePath(url));
        return uri;
       } catch (error) {
        return null
       }
    }

export const getLocalFilePath = filePath =>{
  let fileName = filePath.split('/').pop();
  return `${FileSystem.documentDirectory}${fileName}`;
}
