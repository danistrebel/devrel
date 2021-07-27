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

const sinon = require("sinon");

let contextGetVariableMethod;
let contextSetVariableMethod;

/**
 * Stateful representation of all context.setVariable calls
 * @return {map} map of the last state as Key-Value representation
 */
function variableState() {
    const state = {};
    for (let i=0; i<contextSetVariableMethod.callCount; i++) {
        const call = contextSetVariableMethod.getCall(i);
        state[call.args[0]] = call.args[1];
    }
    return state;
}

beforeEach(function () {
    global.context = {
        getVariable: function (s) { },
        setVariable: function (s, a) { },
    };
    global.httpClient = {
        get: function (s) { }
    }
    httpClientGetMethod = sinon.stub(global.httpClient, "get");
    contextGetVariableMethod = sinon.stub(global.context, "getVariable");
    contextSetVariableMethod = sinon.spy(global.context, "setVariable");
});

afterEach(function () {
    contextGetVariableMethod.restore();
    contextSetVariableMethod.restore();
});

exports.getMock = function () {
    return {
        contextGetVariableMethod: contextGetVariableMethod,
        contextSetVariableMethod: contextSetVariableMethod,
        httpClientGetMethod: httpClientGetMethod,
    };
};

exports.variableState = variableState;
