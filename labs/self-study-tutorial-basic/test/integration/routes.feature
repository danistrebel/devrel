Feature: Basic Tutorial
  As a Apigee user
  I want to participate in a self-study tutorial
  such that I can get a better picture of available features and best-practices

  Scenario: I should get correct CORS headers on a OPTIONS request
    When I request OPTIONS for /validate
    Then response header Access-Control-Allow-Origin should exist
    And response header Access-Control-Allow-Headers should exist
    And response header Access-Control-Allow-Methods should exist

  Scenario: The token endpoint should exist
    When I POST to /token
    Then response code should be 401

  Scenario: I should get 404 on any inexistent path
    When I GET /nothing-here
    Then response code should be 404