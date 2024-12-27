class ApiResponse { // jab bhi kisi   ko response bhajay gay to  isi class ka thorugh hi bhaijain gay // to statuscode lagay ga hi lagay ga data lagay ga hi lagay ga ya ho sakta ha null kar dey
    constructor(statusCode, data, message = 'Success'){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        /*
        why less than 400
        -->Server kay status Codes hotay han
	        Informational responses (100 – 199)
	        Successful responses (200 – 299)
	        Redirection messages (300 – 399)
	        Client error responses (400 – 499)
	        Server error responses (500 – 599)
        */
    }
}

export {ApiResponse}