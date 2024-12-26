// ye sirf ik method bnai ga or usko export kar de ga
// appraoch 2 promises
const asyncHandler = (requestHander) => { // iska faida kar cheez ko humai promises ma nahi dalna paray ga try catch ma nahi dalna paray ga
    // as it is return kar dena ha promise ki formate ma
    return (req, res, next) => {
        Promise.resolve(
            requestHander(req, res, next)
        ).catch( // catch or reject you want to use
            (error)=>next(error)
        )
    }
};

export { asyncHandler };

// const asyncHandler = (fn) => {()=>{}};
// const asyncHandler = (fn) => ()=>{};
// const asyncHandler = (fn) => {async () => {}};
// const asyncHandler = (fn) => async ()=>{};
/* // approach 1 try catch
const asyncHandler = (fn) => async (req, res, next)=>{
    try {
        await fn(req, res, next) // await karo or jo function apnay leya ha usko execute karo
    } catch (error) {
        res.send(error.code || 500) // error ka ander response code a jai ga agar nahi ai ga to hum isi tarha bheej dein gay
        .json({ // further status to apnay bheej dia ha ap json response bhi bhej saktay han
            success: false, // ismay ik to success flag hota ha q k frontend walay ko easy rahay
            message: error.message // or error ka message

        })
        yaha par jab ap error bhej rahay thay 
        obvious se bat ha ap kafi bar return karo gay
        or error ka koi structure nahi ha hamaray pas mun 
        kara status code bhej dia man kara nahi bheja mun
        kara json response bhej dia man kara nahi bheja
        to isko bhi ikk standard formate me humai rakhna paray ga
        ka itnai cheexai to humbhejtay hi bhejtay han 
        to error ko error or respose bhi ma standardize karna 
        chahta hu to thora sa or code likhna paray ga is se apka code base
        standardize ho jata ha matlab error ata to isi formate ma ata ha or 
        response ata ha to isi formate ma ata ha to 
        iskay leay thori parhai karni paray gi (node js api error)
        https://nodejs.org/api/errors.html it will give you whole class of Errors
    }
};
*/