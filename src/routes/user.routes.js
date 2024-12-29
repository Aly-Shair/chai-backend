import { Router } from "express";
import {loginUser, logoutUser, registerUser} from '../controllers/user.controller.js'
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router(); // creating router

router.route('/register').post(
    upload.fields([ // injecting middleware
        { // field 1
            name: 'avatar', // jab apka frontend ka field banay ga tab bhi ap uska name avatar hi rakho gay ye communication hona lazmi ha frontend or backend engineers ma
            maxCount: 1
        },
        { // field 2
            name: 'coverImage',
            maxCount: 1
        }
    ]), // array execept karta ha
    // array isi leya nahi leya q k array ik hi field ma multiple files hoti ha // humay fields chaheya
    registerUser
) // register route par koi bhi request kar raha ha to ye method execute ho jata ha // ma chahta hu ye method to execute ho jai magar jatay huya mujhsey mil kar jana isi leya "upload" import karwa ha

router.route('/login').post(loginUser)

/* secured routes */

router.route('/logout').post(verifyJwt, logoutUser)

export default router;