Feature: Basic Tutorial
  As a Apigee user
  I want to participate in a self-study tutorial
  such that I can get a better picture of available features and best-practices

  Scenario: I should be able to list a tutorial step
    When I GET /tasks/0
    Then response code should be 200
    And response body path $.step should be 0
    And response body path $.finalStep should be false

  Scenario: I should get a 404 error for negative task numbers
    When I GET /tasks/-1
    Then response code should be 404

  Scenario: I should get a 404 error for too large task numbers
    When I GET /tasks/100
    Then response code should be 404