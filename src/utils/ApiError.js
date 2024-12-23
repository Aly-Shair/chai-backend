class ApiError extends Error{
    constructor(
        statusCode,
        message = 'something went wrong', // sab se bakar message koi ref nahi deta kay problem kia ha
        errors = [],
        stack = ''
    ){
        super(message) // overwrite karna ha to super use ho ga //message ko to overwrite karna hi karna ha
        this.statusCode = statusCode;
        this.message = message;
        this.data = null; // read docs
        this.errors = errors;
        this.success = false;
        // you can avoid below code (if else)
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}