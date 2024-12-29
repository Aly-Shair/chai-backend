// ye method sirf verify karay ga kay use ha ya nahi ha verify

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// verify ku karwana ha q k user ko login kartay waqt apnay access token or refresh token de deya to usi ki base par to apko verify karna ha kay apkay pas sahi token ha ya nahi ha to wohi to apka true login hua to agar apkay pas true login ha to ma req ma new object add kar do ga (req.user u can use any name) like req.body req.files 
export const verifyJwt = asyncHandler(async (req, _, next) => { // kai bar esa dikay ga kay req use ho raha ha next use ho raha ha but res use nahi ho raha to usko ap likh saktay ho underscore "_" 
    // req ka pas cookies ka access but how thats why app.use(cookieParser())
    // optional checking because ho sakta ha cookies ka access ho req ka andar ho sakta ha na ho
    // Q nahi ho ga access // yad ha scenario bataya mobile application ka
    // to kia pata yaha se nahi aa raha ho user ik custom header bhej raha ho to usko bhi check kar letay han
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace('Bearer ', "")
    
        if(!token){ // agar token nahi ha
            throw new ApiError(401, 'unauthorized request')
        }
    
        // agar token ha to humay jwt ka use kar key puchna paray ga kay token sahi ha nahi ha
    
        // jwt.verify(kia verify karwana ha, token to ap generate kar saktay ho uskay andar info bhi dal saktay ho par usko decode wohi kar pai ga jiskaypas wo secret ho ja)
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            // TODO: discuss about frontend
            throw new ApiError(401, 'Invalid access Token')
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid access Token')
    }
})