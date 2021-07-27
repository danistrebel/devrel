/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var proxyUrl = context.getVariable("proxy.url");
var proxyBaseURI = proxyUrl.substr(0, proxyUrl.indexOf("/validate"));

/**
 * Set Validation Success
 */
function validationSuccess() {
    successMessage = { success: true }
    context.setVariable("response.content", JSON.stringify(successMessage));
}

/**
 * Set a validation error
 * @param {string} error Validation error message
 */
function validationError(error) {
    errorMessage = { error: error }
    context.setVariable("response.status.code", 400);
    context.setVariable("response.content", JSON.stringify(errorMessage));
}

/**
 * Perform a synchronous get request to validate the proxy implementation
 * @param {string} endpoint to test
 * @return {*} response or error
 */
function getFromEndpoint(endpoint) {
    var exchangeObj = httpClient.get(endpoint);
    exchangeObj.waitForComplete();
    if (exchangeObj.isSuccess())  {
        response = exchangeObj.getResponse()
        context.setVariable("debug.endpoint-response", JSON.stringify(response));
        content = response.content.asJSON;
        headers = response.headers;
        return { status: response.status, response: content, headers: headers};
    } else {
       error = exchangeObj.getError();
       return { error: error };
    }
}


/**
 * Validate Step 0
 * @param {*} implementation
 * @return {void}
 */
function validateStep0(implementation) {
    if (implementation.endpoint === "") {
        validationError("Endpoint is not defined");
        return;
    }
    var getResult = getFromEndpoint(implementation.endpoint);
    if (getResult.error) {
        validationError("Request failed with: " + getResult.error);
        return;

    }
    var response = getResult.response.value;
    if (!response) {
        validationError("Expected a `value` entry in the response");
        return;
    } else if (response.indexOf("It is better") < 0 && response.indexOf("We know what") < 0) {
        validationError("Returned an unexpected quote: " + response);
        return;
    }
    validationSuccess();
}


/**
 * Validate Step 1
 * @param {*} implementation
 * @return {void}
 */
function validateStep1(implementation) {
    if (implementation.endpoint === "") {
        validationError("Endpoint is not defined");
        return;
    }
    if (implementation.endpoint.indexOf(proxyBaseURI) >= 0) {
        validationError("You are using the backend directly without a proxy");
        return;
    }
    var getResult = getFromEndpoint(implementation.endpoint);
    if (getResult.error) {
        validationError("Request failed with: " + getResult.error);
        return;

    }
    var response = getResult.response.value;
    if (!response) {
        validationError("Expected a `value` entry in the response");
        return;
    } else if (response.indexOf("It is better") < 0 && response.indexOf("We know what") < 0) {
        validationError("Returned an unexpected quote: " + response);
        return;
    }

    validationSuccess();
}

/**
 * Validate Step 2
 * @param {*} implementation
 * @return {void}
 */
 function validateStep2(implementation) {
    if (implementation.endpoint === "") {
        validationError("Endpoint is not defined");
        return;
    }
    if (implementation.endpoint.indexOf(proxyBaseURI) >= 0) {
        validationError("You are using the backend directly without a proxy");
        return;
    }
    var getResult = getFromEndpoint(implementation.endpoint);
    if (getResult.error) {
        validationError("Request failed with: " + getResult.error);
        return;

    }
    if (!getResult.response.value) {
        validationError("Expected a `value` entry in the response");
        return;
    }

    if (!getResult.headers || !getResult.headers['x-developer']) {
        validationError("Request was not authenticated");
        return;
    }

    validationSuccess();
}


try {
    var validationRequest = JSON.parse(context.getVariable("request.content"));
    context.setVariable("debug.validationRequest", JSON.stringify(validationRequest));

    const validations = [
        validateStep0,
        validateStep1,
        validateStep2
    ]

    if (validationRequest.task >= 0 && validationRequest.task < validations.length) {
        validations[validationRequest.task](validationRequest.implementation);
    } else {
        validationError("unknown step")
    }
} catch(err) {
    validationError("Error processing request: " + context.getVariable("request.content") + " errror: " + err);
}
