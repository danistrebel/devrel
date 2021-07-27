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

const assert = require("assert");
const mockFactory = require("./common/mockFactory");

const stepValidationResource = "../../../apiproxy/resources/jsc/validate-step.js"

const requireUncached = require("./common/requireUncached");

/**
 * Detect missing in endpoint task validation
 * @param {number} task
 */
function detectMissingEndpoints(task) {
    const mocks = mockFactory.getMock();

    mocks.contextGetVariableMethod
        .withArgs("proxy.url")
        .returns("https://example-tutorial.google.com/v1/validate");

    const request = {
        implementation: {
            endpoint: ""
        },
        task: task
    };

    mocks.contextGetVariableMethod
        .withArgs("request.content")
        .returns(JSON.stringify(request));


    requireUncached(stepValidationResource);
    const stateSnapshot = mockFactory.variableState();

    const errorMessage = JSON.parse(stateSnapshot["response.content"]).error;
    assert.strictEqual(errorMessage, "Endpoint is not defined", "correct error message");
}

/**
 * Detect endpoints that do not use an API proxy
 * @param {number} task
 */
function detectUnproxiedEndpoints(task) {
    const mocks = mockFactory.getMock();

    mocks.contextGetVariableMethod
        .withArgs("proxy.url")
        .returns("https://example-tutorial.google.com/v1/validate");

    const request = {
        implementation: {
            endpoint: "https://example-tutorial.google.com/v1/wisdom"
        },
        task: 1
    };

    mocks.contextGetVariableMethod
        .withArgs("request.content")
        .returns(JSON.stringify(request));


    requireUncached(stepValidationResource);
    const stateSnapshot = mockFactory.variableState();

    const errorMessage = JSON.parse(stateSnapshot["response.content"]).error;
    assert.strictEqual(errorMessage, "You are using the backend directly without a proxy", "correct error message");
}

/**
 * Call mock endpoint and return Apigee flow variable state changes
 * @param {*} task
 * @param {*} response
 * @param {*} responseHeaders
 *
 * @return {*} Apigee state
 */
function validateEndpointResult(task, response, responseHeaders) {
    const mocks = mockFactory.getMock();

    const mockEndpoint = "https://example-solution.google.com/v1/wisdom"

    mocks.contextGetVariableMethod
        .withArgs("proxy.url")
        .returns("https://example-tutorial.google.com/v1/validate");

    mocks.httpClientGetMethod
        .withArgs(mockEndpoint)
        .returns({
            waitForComplete: () => { },
            isSuccess: () => true,
            getResponse: () => { return { content: { asJSON: response }, headers: responseHeaders } }
        });

    const request = {
        implementation: {
            endpoint: mockEndpoint
        },
        task: task
    };

    mocks.contextGetVariableMethod
        .withArgs("request.content")
        .returns(JSON.stringify(request));


    requireUncached(stepValidationResource);
    return mockFactory.variableState();
}

describe("Step Validation", function () {
    describe("Step Validation", function () {
        it("should detect unknown steps", function () {
            const mocks = mockFactory.getMock();

            mocks.contextGetVariableMethod
                .withArgs("proxy.url")
                .returns("https://example-tutorial.google.com/v1/validate");

            const request = {
                implementation: {
                    endpoint: ""
                }
            };

            mocks.contextGetVariableMethod
                .withArgs("request.content")
                .returns(JSON.stringify(request));


            requireUncached(stepValidationResource);
            const stateSnapshot = mockFactory.variableState();
            const errorMessage = JSON.parse(stateSnapshot["response.content"]).error;

            assert.strictEqual(stateSnapshot["response.status.code"], 400, "Set a 400 response status");
            assert.strictEqual(errorMessage, "unknown step", "Set the right response content");
        });
    });

    describe("Step 0 Validation", function () {
        it("should detect missing endpoints", () => detectMissingEndpoints(0));
    });

    describe("Step 1 Validation", function () {
        it("should detect missing endpoints", () => detectMissingEndpoints(1));

        it("should detect unproxied requests", () => detectUnproxiedEndpoints(1));

        it("should detect unknown quotes", function () {
            const stateSnapshot = validateEndpointResult(1, { value: "my-random-quote" }, null)
            const errorMessage = JSON.parse(stateSnapshot["response.content"]).error;
            assert.strictEqual(errorMessage, "Returned an unexpected quote: my-random-quote", "correct error message");
        });

        it("should pass validation", function () {
            const stateSnapshot = validateEndpointResult(1, { value: quotes[0] }, null)
            const validationResponse = JSON.parse(stateSnapshot["response.content"]);
            assert(validationResponse.success, "Successful validation");
        });
    });
    describe("Step 2 Validation", function () {
        it("should detect missing endpoints", () => detectMissingEndpoints(2));
        it("should detect unproxied requests", () => detectUnproxiedEndpoints(2));
        it("should detect a missing developer header", function () {
            const stateSnapshot = validateEndpointResult(2, { value: quotes[4] }, null)
            const errorMessage = JSON.parse(stateSnapshot["response.content"]).error;
            assert.strictEqual(errorMessage, "Request was not authenticated");
        });
        it("should pass validation", function () {
            const stateSnapshot = validateEndpointResult(2, { value: quotes[0] }, {"x-developer": "some-dev@example-solution.google.com"})
            const validationResponse = JSON.parse(stateSnapshot["response.content"]);
            assert(validationResponse.success, "Successful validation");
        });
    });
});