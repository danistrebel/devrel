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
if (!sessionStorage.getItem('apigee.tutorialEndpoint')) {
  const tutorialEnpoint = window.prompt("Enter the endpoint for this tutorial:"); // TODO test tutorial endpoint.

  sessionStorage.setItem('apigee.tutorialEndpoint', tutorialEnpoint);
}

new Vue({
  el: '#apigee-tutorial ',
  data: {
    currentStep: -1,
    maxStep: -1,
    finalStep: false,
    stepInstruction: "",
    implementation: {
      endpoint: ""
    },
    appState: {}
  },
  created: function () {
    this.maxStep = parseInt(sessionStorage.getItem('apigee.maxStep'), 10) || this.maxStep;

    if (!sessionStorage.getItem('apigee.currentTaskDescription')) {
      this.fetchNthStep(0);
    } else {
      const storedTask = JSON.parse(sessionStorage.getItem('apigee.currentTaskDescription'));
      this.stepInstruction = storedTask.instruction;
      this.currentStep = storedTask.step;
    }
  },
  methods: {
    checkProgress: function (event) {
      fetch(`${sessionStorage.getItem('apigee.tutorialEndpoint')}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          implementation: this.implementation,
          task: this.currentStep
        })
      }).then(response => response.json()).then(data => {
        if (data.error) {
          M.toast({
            html: data.error
          });
        } else {
          this.fetchNthStep(this.currentStep + 1);
        }
      }).catch(error => {
        console.error('Error:', error);
      });
    },
    refreshApp: function (event) {
      if (!this.implementation.endpoint) {
        this.appState = {
          error: "No Endpoint Specified"
        };
        return;
      }

      fetch(this.implementation.endpoint).then(response => {
        console.log(response);
        return response.json();
      }).then(data => {
        if (data.value) {
          this.appState = {
            value: data.value
          };
        }
      }).catch(err => {
        this.appState = {
          error: err.stack
        };
      });
    },
    resetApp: function (event) {
      if (window.confirm("Are you sure you want to reset this lab? All progress will be reset.")) {
        sessionStorage.clear();
        window.location.reload();
      }
    },
    fetchNthStep: function (n) {
      fetch(`${sessionStorage.getItem('apigee.tutorialEndpoint')}/tasks/${n}`).then(response => response.json()).then(data => {
        sessionStorage.setItem('apigee.currentTaskDescription', JSON.stringify(data));
        this.stepInstruction = data.instruction;
        this.currentStep = data.step;
        this.maxStep = Math.max(this.maxStep, data.step);
        sessionStorage.setItem('apigee.maxStep', this.maxStep);
        this.finalStep = data.finalStep;
      }).catch(error => {
        console.error('Error:', error);
      });
    }
  }
});