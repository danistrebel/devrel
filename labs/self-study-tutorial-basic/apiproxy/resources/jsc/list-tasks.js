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

/* eslint-disable no-multi-str */

var proxyUrl = context.getVariable("proxy.url");
var tasksFragment = "/tasks"
var proxyBaseURI = proxyUrl.substr(0, proxyUrl.indexOf(tasksFragment));
var taskIndex = parseInt(proxyUrl.substr(proxyUrl.indexOf(tasksFragment) + tasksFragment.length + 1), 10);

tasks = [
// Step 0
"\
# Apigee Beginner Lab\n\
## Introduction \n\
Welcome to the Apigee API developer lab, we are excited to have you here! \n\
\n\
On the screen on the right you see a mobile application that is supposed to leverage an API that you provide. \n\
To get you familiar with this lab environment, we first ask you to use the provided API endpoint as the API backend for your application `" + proxyBaseURI +"/wisdom`. \n\
\n\
## Instructions \n\
1. Put the endpoint URI in the configuration box of the app on the right. \n\
1. Click on \"Refresh App\" to see how the application is using your backend. \n\
1. Click on \"Check Progress\" to continue to the next step",
// Step 1
"\
# Apigee Beginner Lab\n\
## Pass-Through Proxy \n\
Of course you're asking yourself 'so where does Apigee fit in when I can directly use this API' \n\
\n\
In this step we're asking you to implement an API proxy in Apigee and use that one as the backend for your application. \n\
The target of the proxy should again be the same URL as before `"+ proxyBaseURI +"/wisdom` \n\
\n\
## Instructions \n\
1. Put the API Proxy URI in the configuration box of the app on the right. \n\
1. Click on \"Refresh App\" to check your output \n\
1. Click on \"Check Progress\" to continue to the next step",
// Step 2
"\
# Apigee Beginner Lab\n\
## Backend Authentication \n\
Your users (the App developers) are loving your API and are thirsty for more. More in this case means more wisdom.\n\
The backend developer is willing to offer you a different service if you obtain an OAuth token. They pointed you to the developer portal <TBD> to obtain a developer account and access credentials. \n\
\n\
## Instructions \n\
1. Visit the developer portal and obtain your client id and secret. \n\
1. Implement service callout within your proxy to obtain a valid access token for your credentials\n\
1. Attach the access code to your backend request as a Bearer token",

"\
# Apigee Beginner Lab\n\
## Finished \n\
Congrats, you finished this tutorial. Let us know how it went!"
];

if (taskIndex >= 0 && taskIndex < tasks.length) {
    response = {instruction: tasks[taskIndex], step: taskIndex, finalStep: taskIndex === tasks.length-1};
    context.setVariable("response.content", JSON.stringify(response));
} else {
    context.setVariable("response.status.code", 404);
}

