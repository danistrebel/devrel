/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const assert = require("assert");
const mockFactory = require("./common/mockFactory");

const randomQuoteResource = "../../../apiproxy/resources/jsc/random-quote.js"
const requireUncached = require("./common/requireUncached");

describe("Random Quote", function () {
    describe("Unauthenticated access", function () {
        it("should return one of two quotes", function () {
            requireUncached(randomQuoteResource);

            const stateSnapshot = mockFactory.variableState();

            const response = JSON.parse(stateSnapshot['response.content']);

            quotesIndex = quotes.indexOf(response.value);
            assert(quotesIndex >= 0, "quote picked from the list");
            assert(quotesIndex < 2, "quote picked form the first two entries");
        });
    });

    describe("Authenticated access", function () {
        it("should return any of the quotes and add an x-developer header", function () {
            const mocks = mockFactory.getMock();

            const devEmail = "dev@example-tutorial.google.com";

            mocks.contextGetVariableMethod
                .withArgs("developer.email")
                .returns(devEmail);

            requireUncached(randomQuoteResource);

            const stateSnapshot = mockFactory.variableState();

            const response = JSON.parse(stateSnapshot['response.content']);
            const developerHeader = stateSnapshot['response.header.x-developer'];

            quotesIndex = quotes.indexOf(response.value);
            assert(quotesIndex >= 0, "quote picked from the list");
            assert.strictEqual(developerHeader, devEmail, "developer header set")
        });
    });
});
