import multer from "multer";

const storage = multer.diskStorage({ // we are using diskstroage u can also use memorystorage
    destination: function (req, file, cb) { // ye file multer ka pas hi hota ha(isi leya hi multer use hota ha agar json data ka sath file bhi arahi ho to request ka andar humney json data to configure kar hi deya ha magar file nahi ki) //request user se arahi hoti ha //
      cb(null, './public/temp') // cb is a call back having many other argumantes erros etc
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // it is not good to write original name// ho sakta ha user ki ali name ki 5 files aa jai to overwrite ho jai // lekin ye operation me itnay kam time ka leya hamaray pas rahay gi t0 tension ki zaroorat nahi ha
    //   log file assignment
    }
  })
  
  export const upload = multer({ 
    // storage: storage
    storage, // if using ES6
   })