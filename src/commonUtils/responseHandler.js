exports.responseHandler = (apiResponse) => {
    try {
        let response = {
            responseCode: apiResponse.code || "200",
            responseMessage: apiResponse.message || "success",
            apiResponseTime: new Date().toISOString(),
            apiResponseData: apiResponse.data || {}
        };

        return response;

    } catch (error) {
        let response = {
            responseCode: "500",
            responseMessage: error.message || "Internal Server Error",
            apiResponseTime: new Date().toISOString(),
            apiResponseData: {}
        };

        return response;
    }
};
