import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js' // importing here to check if the user already exist or not
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    // res.status(200).json({
    //     message:"ok"
    // })

    /*
        1. get user details from frontend
        2. check validation-not empty or email formate // making validation seperate files is best
        3.check if user already exist (username, email)
        4. check for images - check for avatar
        5. upload them to cloudinary, avatar
        6. create user object - create entry in db(jab bhi ap entry kartay ho mongodb ma to jobhi kuch bana ha wo as it is sara response ma aa jata ha)
        7. remove password and refresh token field from response
        8.  check for usercreation 
        9. return response
    */

//    getting user details from req.body
console.log('this is req.boody: ', req.body)
    const {username, email, fullName, password} = req.body // body se data aa sakta ha url se form se json se, sab ka data body se mil jai ga except URL
    // these values are from model of user {username, email, fullName, password} we have destructure it
    console.log('email', email); // we test it using postman // postman se raw data send karnay ka matlb hota ha ap seedha json encode kar do

    if ([username, email, fullName, password].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "fill required fields")
    } // instead of this you can use if for all fields saparately

    // more valdation is in email @ symbol exist or not

    // checking if user already exist

    // User.findOne({email})
    // User.findOne({username}) // you can find seperate seperate

    const existedUser = await User.findOne({ // ye return karay ga apko jo bhi isey document mila ha is username or ka email ka
        // you can use many operators using $
        $or: [{email},{username}]
    })

    if(existedUser){
        throw new ApiError(409, "User with same email or username already exist")
    }

    console.log('this is req.files: ', req.files)

    // req.files // files is not from express it is form multer
    const avatarLocalPath = req.files?.avatar[0]?.path //optionally chain karna ziada bahtar rahta ha 
    // we have named it avatar(in middleware) so using name here avatar // a field has many options we need first option at zero idx and geting its path
    // const coverImageLocalPath = req.files.coverImage[0]?.path;

///////////////////////////////////////////////////
    let coverImageLocalPath; // the advance check which is on the above lines // give an error if coverImage is not given (cannot read the properties of undefined)
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
///////////////////////////////////////////////////


    // checking is avatar available

    if(!avatarLocalPath){
        throw new ApiError(400, 'Profile pic is required')
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath); // server par upload ho rahi ha to time lagay ga isi leya await lagay ga
    const coverImage = await uploadOnCloudinary(coverImageLocalPath); // agar cloudinary ko local path nahi mil raha coverImage ka to wo error return nahi kar raha bas empty string return kar raha ha ye bohat hi achi bat ha 
    
    if(!avatar){ // agar cloudinary par upload nahi hua to error de do warna database ma error ai ga
        throw new ApiError(400, 'Profile pic is required')
    }

    // creating object and enter into database

    const user = await User.create({ // await ku kay time lagta ha
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()        
    })

    // checking if use is created in db or not
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // kia kia nahi chaheya ha wohi likhna ha minus(-) laga kar or keywords ka darmian sirf space deni ha koi comma nahi
    )

    if(!createdUser){
        throw new ApiError(500, 'Something went wrong while registering the user')
    }

    // returning response

    return res.status(201) //  status ko alag se bhi bhej rahay han ku kay postman ma dekha ho ga kay jab response ata ha to status code ata ha or alaga jagahya dalta ha to postman isi ko expect kar raha hota ha kay kisi ne .status kar kay status bheja ho ga
    .json(
        new ApiResponse(200, createdUser, 'User Registered Successfully')
    )
} )

export {registerUser};
