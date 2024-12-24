// this code is reuseable can use in any project

// file server par aa chuki ha ab server se ap mujhey local path do gay 
// or ma usey cloudinary par dal du ga
// and then remove from the server

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs' // fs is file system by default with nodejs

cloudinary.config({  // ye configuration hi ha jo apko file upload karnay ki premission de gi warna usko kasey pata kon sa account upload kar raha ha
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
 
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,{
            // many options
            resource_type: 'auto' // image, video, etc
        })
        // file has been uploaded
        // console.log('File has been uploaded Successfully' + response);
        console.log('File has been uploaded Successfully' + response.url);
        return response;
    } catch (error) {
        fs.unlink(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}

// const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });