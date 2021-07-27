Feature: Step Validation
  As a Apigee user
  I want to participate in a self-study tutorial
  such that I can get a better picture of available features and best-practices

  Scenario: I should be able to validate my implementation for a step
    Given I set body to { "task": 0, "implementation": { "endpoint": "" }}
    When I POST to /validate
    Then response code should be 400
    And response body path $.error should be Endpoint is not defined
