import mongoose, { Schema } from "mongoose";
import { Jwt } from "jsonwebtoken";
import bcrypt from 'bcrypt' // we use mongoose hooks for encryption // direct encrypt karna possible nahi ha


const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
        index: true // database me kisi bhi field ko agar searchable banana ha baray optimize tarikay se to uska index true kardo // thora expensive ho jata ha
    },
    email:{
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type:String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String, // we use cloudnary URL 
        required: true,
    }, 
    coverImage:{
        type: String
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    password:{
        type: String, // we will encrypt or Hash it to store in database for security purpose
        required:[true, 'Password is Required']
    },
    refreshToken:{
        type: String,
    }
}, {timestamps: true})

userSchema.pre('save', async function (next) { // jab bhi data save ho raha ha usey pahlay mujhey ye function run karwana ha
    // dont use arrow function because in arrow function we have not access of this usey context nahi pata hota // yaha context pata hona bohat zaroori ha ku kay ye save event kis par chal raha ha user par // to user ka anndar jo code  likha ha usey manupulate bhi to karna ha
    // encryption is timeconsuming and complex so use async
    // next becaues it is a middlerware
    // jab kam ho jai to next ko call karna parta ha kay ye flag ab agay pas kar do
    // this.password = bcrypt.hash('kisko hash karna ha', 'kitnay rounds lagao a number eg salts')
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()

    // problem:
    // kisi ne avatar upate keya ha to ye dobara password change kar de ga ku kay even laga ha puray User par
    // to solve this use if(this.isModified('password')) jab password ma change ho tabhi ye karo
})

userSchema.methods.isPasswordCorrect = async function (password) { // isPasswordCorrect is our costum method created using mongoose
    return await bcrypt.compare(password, this.password) 
    // we are comparing user Entered password and the password in the database 
    // cryptography ha computation power use hoti ha to await karna paray ga
}

userSchema.methods.generateAccessToken = function () {
    // chahey vaiable me hold kar key return karo chaheya direclty return kar do
    return Jwt.sign({ // sign method to generate token
        _id: this._id, // _id is syntax of mongodb it stored id using underscore
        email: this.email,
        username: this.username,
        fullName: this.fullName
    //  payload name: database se aa rahi ha // things to understand
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })

    // IS PROCESS MA TIME NAHI LAGTA HA YAHA ENCRYPTION ALGO BASIC HI HA
    // TO ASYNC AWAIT LAGANAY KI ZAROORAT NAHI
}
userSchema.methods.generateRefreshToken = function () {
    return Jwt.sign({
        _id: this._id, // Refresh token ma data kam hota ha ku kay ye bar bar refresh hota ha
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model('User', userSchema);
// ye User direct bat kar sakta ha database se ku kay mongoose kay through bana ha