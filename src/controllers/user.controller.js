import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"; // importing here to check if the user already exist or not
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        // access token to hum user ko de detay han lekin refresh token hum database ma bhi store kartay han takay password na puchna paray user se
        user.refreshToken = refreshToken;
        // user.save() // jab ap save karwanay lagtay an na to mongoose kay model bhi kikin ho jatay han for example: ye password wala method bhi kickin hojai ga ye jab bhi save karwao to password hona hi chaheya par yaha to password de hi nahi rahay
        /*
            password:{
                type: String, 
                required:[true, 'Password is Required']
            },
        */ // esi situation ma ap ik parameter pass kartay ho
        // database ka operation ha time lagnay hi wala ha to await karwa do
        await user.save({ validateBeforeSave: false }) // validation kuch mat lagao bas save kar do
    
            return {
                accessToken,
                refreshToken
            }

    } catch (error) {
        throw new ApiError(500, 'something went wrong while generating Access and Refresh token')
    }
};

const registerUser = asyncHandler(async (req, res) => {
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
  console.log("this is req.boody: ", req.body);
  const { username, email, fullName, password } = req.body; // body se data aa sakta ha url se form se json se, sab ka data body se mil jai ga except URL
  // these values are from model of user {username, email, fullName, password} we have destructure it
  console.log("email", email); // we test it using postman // postman se raw data send karnay ka matlb hota ha ap seedha json encode kar do

  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "fill required fields");
  } // instead of this you can use if for all fields saparately

  // more valdation is in email @ symbol exist or not

  // checking if user already exist

  // User.findOne({email})
  // User.findOne({username}) // you can find seperate seperate

  const existedUser = await User.findOne({
    // ye return karay ga apko jo bhi isey document mila ha is username or ka email ka
    // you can use many operators using $
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with same email or username already exist");
  }

  console.log("this is req.files: ", req.files);

  // req.files // files is not from express it is form multer
  const avatarLocalPath = req.files?.avatar[0]?.path; //optionally chain karna ziada bahtar rahta ha
  // we have named it avatar(in middleware) so using name here avatar // a field has many options we need first option at zero idx and geting its path
  // const coverImageLocalPath = req.files.coverImage[0]?.path;

  ///////////////////////////////////////////////////
  let coverImageLocalPath; // the advance check which is on the above lines // give an error if coverImage is not given (cannot read the properties of undefined)
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  ///////////////////////////////////////////////////

  // checking is avatar available

  if (!avatarLocalPath) {
    throw new ApiError(400, "Profile pic is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath); // server par upload ho rahi ha to time lagay ga isi leya await lagay ga
  const coverImage = await uploadOnCloudinary(coverImageLocalPath); // agar cloudinary ko local path nahi mil raha coverImage ka to wo error return nahi kar raha bas empty string return kar raha ha ye bohat hi achi bat ha

  if (!avatar) {
    // agar cloudinary par upload nahi hua to error de do warna database ma error ai ga
    throw new ApiError(400, "Profile pic is required");
  }

  // creating object and enter into database

  const user = await User.create({
    // await ku kay time lagta ha
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // checking if use is created in db or not
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // kia kia nahi chaheya ha wohi likhna ha minus(-) laga kar or keywords ka darmian sirf space deni ha koi comma nahi
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // returning response

  return res
    .status(201) //  status ko alag se bhi bhej rahay han ku kay postman ma dekha ho ga kay jab response ata ha to status code ata ha or alaga jagahya dalta ha to postman isi ko expect kar raha hota ha kay kisi ne .status kar kay status bheja ho ga
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    /*
        req body -> data
        username or email validate and password
        find user in database
        password check
        access and refresh token (generate)
        send cookie
    */

        const {username, email, password} = req.body;

        if(!username || !email){
            throw new ApiError(400, 'username or email is required');
        }


        // const user = User.findOne({email})
        // const user = User.findOne({username})
        const user = await User.findOne( // findOne jasey hi pahli entry miljati ha db ma wo return kar deta ha
            {
                $or: [{email}, {username}] // isdono me se koi bhi correct hua to login karwa dein gay
            }
        )

        if(!user){
            throw new ApiError(404, 'user does not exist')
        }
        
        // user iskay pas saray methods available ha jo humnay inject keya han through mongoose in the user.models.js file
        
        const isPasswordValid = await user.isPasswordCorrect(password)
        
        if(!isPasswordValid){
            throw new ApiError(401, 'invalid user credentials')
        }

        // creating access and refresh token
        // ab ye access or refresh token wala kam jo ha na wo ap kai bar karo gay
        // infact ye kam itna common ha kai jagah ye humay use ai ga to isko ik method ma dal detay han
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id) // optional step cuz we already have this user above
        .select("-password -refreshToken")

        // sending cookies
        // kuch options(an object) design karnay partay han humay cookies kay leya

        const options = { // jab ap httpOnly: true,secure: true kar detay ho tab hota ye ha key ye cookies server se hi modified hoti han frontend se nahi ho sakti bas show ho gi
            httpOnly: true,
            secure: true
        }

        // cookie(key, value) // cookie parser is needed to use this

        return res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken // cookie ma send ki ha access or refresh to yaha ku bhej rahay ho // just achi practice ha
            },
            "user loggedin successfully")
        )


});

const logoutUser = asyncHandler(async (req, res) => {
  // remove refresh token
    // cookies remove karo


    // is function par anay se pahlay ik middleware execute hua ha to humay req.user milay ga
    // req.user._id
    // pura user obj le ai gay ik query mar kar or uska user object delete kar dein gay

  // User.findById() // userLanaParayGaPhirUskaRefreshTokenDelKarnaParayGaPhirUseySaveKarnaParayGaValidateBeforeFalseKarnaParayGa
  await User.findByIdAndUpdate(
     req.user._id,
    {
      $set:{ // mongodb operator
        refreshToken: undefined // kia update karna ha
      }
    },
    {
      new: true // ye laganay se return ma humay updated value milay gi else old value milay gi(to ye refreshToken bhi a hi jai ga but ye undefined wala mujhey chaheya)
    }
  )


    // now removing cookies

    const options = { 
      httpOnly: true,
      secure: true
  }

    return res.status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User logged Out'))

})

export { 
    registerUser,
    loginUser,
    logoutUser
 };
