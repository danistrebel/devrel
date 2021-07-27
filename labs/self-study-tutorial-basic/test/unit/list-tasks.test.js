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

const listTaksResource = "../../../apiproxy/resources/jsc/list-tasks.js"
const requireUncached = require("./common/requireUncached");

describe("List Tasks", function () {
    describe("Boundary checks", function () {
        it("should pick a task if within boundary", function () {
            const mocks = mockFactory.getMock();

            mocks.contextGetVariableMethod
                .withArgs("proxy.url")
                .returns("https://example-tutorial.google.com/v1/tasks/0");

            requireUncached(listTaksResource);
            const stateSnapshot = mockFactory.variableState();
            const response = JSON.parse(stateSnapshot['response.content']);

            assert.strictEqual(response.step, 0, "Correct Step Index");
            assert.deepStrictEqual(response.instruction, tasks[0], "Correct Step Instruction");
            assert.strictEqual(response.finalStep, tasks.length === response.step + 1, "Correct Final Step Flag");
        });
        it("should pick return an error if out of bounds (negative)", function () {
            const mocks = mockFactory.getMock();

            mocks.contextGetVariableMethod
                .withArgs("proxy.url")
                .returns("https://example-tutorial.google.com/v1/tasks/-1");

            requireUncached(listTaksResource);
            const stateSnapshot = mockFactory.variableState();
            const responseCode = stateSnapshot['response.status.code'];
            assert.strictEqual(responseCode, 404, "Correctly set a 404 status");
        });
        it("should pick return an error if out of bounds (too big)", function () {
            const mocks = mockFactory.getMock();

            mocks.contextGetVariableMethod
                .withArgs("proxy.url")
                .returns("https://example-tutorial.google.com/v1/tasks/9999");

            requireUncached(listTaksResource);
            const stateSnapshot = mockFactory.variableState();
            const responseCode = stateSnapshot['response.status.code'];
            assert.strictEqual(responseCode, 404, "Correctly set a 404 status");
        });
    });
    describe("Dynamic templating", function () {
        it("should correctly template the 'wisdom' proxy endpoint", function () {
            const mocks = mockFactory.getMock();

            mocks.contextGetVariableMethod
                .withArgs("proxy.url")
                .returns("https://example-tutorial.google.com/v1/tasks/1");

            requireUncached(listTaksResource);
            const stateSnapshot = mockFactory.variableState();
            const response = JSON.parse(stateSnapshot['response.content']);

            assert(response.instruction.indexOf("https://example-tutorial.google.com/v1/wisdom") > 0, "Correctly template the API proxy");
        });
    });
});
