import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'; // ma meray server se user ka browser jo ha na uskay under ki cookies access kar pao or uskay under ki cookies set bhi kar pao // unkay upar crud operation ma basically perform kar pao
// kuch tarikays hotay han jis se ap secure cookies user ka browser ma rakh pao un secure cookies ko sirf server hi read kar sakta ha server hi sirf unko remove kar sakta ha

const app = express();

app.use(cors()); // mojorly asey configure kar detay han or asey configure ho bhi jata ha

// LEKIN APP options bhi de saktay han cors me ho ik object leta ha

app.use(cors({
    origin:process.env.CORS_ORIGIN, // URL OF OUR FRONT END // har front ko bat nahi karnay de gay(eg. "*") sirf panay frontend ko pat karnay de gay
    credentials: true, // credentials allowed
    // other options are homework
}))

//  data kai jagah se anay wala ha backend ka andar to uski preparation chal rahi ha
// url json body form etc
// ik limit banao ga ka isey ziada json nahi ana chaheya ku kay ziada se server crash kar jata ha
// setting middleware

app.use(express.json({
    limit: '16kb', // it depends on server capability // usually ye aksar ye production grades files ma dikay gay
})) // ap direct hi app ka sath json ko configure kar saktay ho ka ma json ko accept kar raha hu // it takes an obj
// previously express dont accept json to is kay leya body parser use karna parta tha // ab express kar sakta ha par kai code base ma body-parser dikhy ga apko // multer is use for file uploading configuration

app.use(express.urlencoded({
    extended: true, // no need but good
    limit: '16kb' // limit also available her
})) // directly available in express to get data from 'URL' eg (ali shair -> ali+shair OR ali%20shair)

app.use(express.static("public")); // kai bar hum files pdfs store karna chahtay han // images ai ma apnay hi server par store rakhna chahta hu // to ik public folder bana detay han 

app.use(cookieParser()) // iskay under bhi options han magar kabhi need nahi hui unki

// middleware:
// 	apko request ai apnay ap response send karna ha 
// 	ab server par request to bohat sari ai gi
// 	ap us repose ko lenay ka leya cabable ho ya nahi ye middleware se check kartay han
// 	you can use or miltiple middleware
// 	inko laganay ka ik sequence hota ha
// (err, req, res, next)=>{ // is call back ma char options hotay han 
// apnay next use kia ha to mtlb ab middleware kay baray ma bat kar 
// rahay han // next is just a flag
// jab ye wala banda(if check) apna kam kar ley ga to next ik flag pas karta ha ka apna kam to ho chuka ha ab next par chalay jao
// to ye next check(if) ka pas chalay jai ga or usko bhi next flag use karna zaroori ha agar pass karnay ka leya
// phir  jab next yaha pas ho ga (res.send) to wo kahay ga apnay to response hi bhage dia ha to next kuch ha hi nahi to usko(next) discard kar de ga
    // res.send('ali');
// } 


// routes import

import userRouter from './routes/user.routes.js'

// routers declaration
// app.get// ye hum tab boltay thay jab hum is tarha se router nahi export kar rahay hotay thay
// ab router ko lanay ka ley middleware lana paray ga
app.use('/api/v1/users', userRouter) // ab koi bhi user jab type karay ga /users to app controll dedo gay userRouter par
// http:localhost:8000/users/register
// http:localhost:8000/api/v1/users/register


export {app};