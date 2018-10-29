var assert = require("chai").assert,
  filters = require("../../dist/html/ng-filters");

describe("the filter expression matches angular-filters anywhere in the code using {{}}", function() {
  "use strict";

  it("matches a simple translate filter", function() {
    var result = filters.matchAngularExpressions("{{ 'Hy' | translate }}");

    assert.deepEqual(result, [
      {
        value: "'Hy'",
        match: "{{ 'Hy' | translate }}",
        previousFilters: undefined
      }
    ]);
  });

  it("matches an expression with another filter before translate", function() {
    var result = filters.matchAngularExpressions(
      "{{ 'Hy' | currency | translate }}"
    );

    assert.deepEqual(result, [
      {
        value: "'Hy'",
        match: "{{ 'Hy' | currency | translate }}",
        previousFilters: "currency"
      }
    ]);
  });

  it("matches an expression with a filter following translate", function() {
    var result = filters.matchAngularExpressions(
      "{{ 'Hy' | translate | limitTo:6 }}"
    );

    assert.deepEqual(result, [
      {
        value: "'Hy'",
        match: "{{ 'Hy' | translate | limitTo:6 }}",
        previousFilters: undefined
      }
    ]);
  });

  it("matches an expression with a filter before and after translate", function() {
    var result = filters.matchAngularExpressions(
      "{{ 'Hy' | currency | translate | limitTo:6 }}"
    );

    assert.deepEqual(result, [
      {
        value: "'Hy'",
        match: "{{ 'Hy' | currency | translate | limitTo:6 }}",
        previousFilters: "currency"
      }
    ]);
  });

  it("matches multiple expressions", function() {
    var result = filters.matchAngularExpressions(
      "{{ 'Hy' | translate }}<span title=\"{{ 'Login' | translate}}\"></span>"
    );

    assert.deepEqual(result, [
      {
        value: "'Hy'",
        match: "{{ 'Hy' | translate }}",
        previousFilters: undefined
      },
      {
        value: "'Login'",
        match: "{{ 'Login' | translate}}",
        previousFilters: undefined
      }
    ]);
  });

  it("matches an attribute with translate followed by another filter without spaces", function() {
    var result = filters.matchAngularExpressions(
      '{{"name"|translate|limitTo:5}}'
    );

    assert.deepEqual(result, [
      {
        value: '"name"',
        match: '{{"name"|translate|limitTo:5}}',
        previousFilters: undefined
      }
    ]);
  });

  it("matches an attribute with translate where translate follows another filter without spaces", function() {
    var result = filters.matchAngularExpressions(
      '{{"name"|currency|translate}}'
    );

    assert.deepEqual(result, [
      {
        value: '"name"',
        match: '{{"name"|currency|translate}}',
        previousFilters: "currency"
      }
    ]);
  });

  it("matches property expressions", function() {
    var result = filters.matchAngularExpressions("{{user.sex | translate}}");

    assert.deepEqual(result, [
      {
        value: "user.sex",
        match: "{{user.sex | translate}}",
        previousFilters: undefined
      }
    ]);
  });

  it("matches the expression inside a string", function() {
    var result = filters.matchAngularExpressions(
      'Static Text: {{ "CHF" | translate }}'
    );

    assert.deepEqual(result, [
      {
        value: '"CHF"',
        match: '{{ "CHF" | translate }}',
        previousFilters: undefined
      }
    ]);
  });

  it("doesn't match an expression without translate filter", function() {
    var result = filters.matchAngularExpressions("{{ 1 + 2 }}");

    assert.deepEqual(result, []);
  });

  it("doesn't match single curly braces ", function() {
    var result = filters.matchAngularExpressions("{{ '{{1 + 2}}' }}");

    assert.deepEqual(result, []);
  });

  it("doesn't match '| translate", function() {
    var result = filters.matchAngularExpressions("{{| translate}}");

    assert.deepEqual(result, []);
  });

  it("doesn't match a string literal that looks like an expression but misses the {}", function() {
    var result = filters.matchAngularExpressions('"value" | translate');

    assert.deepEqual(result, []);
  });

  /**
   * Not supported in the current version
   */
  it("doesn't match the pipe in the string value", function() {
    var result = filters.matchAngularExpressions(
      '{{"value|test" | translate}}'
    );

    assert.deepEqual(result, [
      {
        value: '"value|test"',
        match: '{{"value|test" | translate}}',
        previousFilters: undefined
      }
    ]);
  });
});
