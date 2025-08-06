# Rules for Effective Unit Testing

## Core Testing Philosophy

**Test behavior, not implementation.** Write tests that verify what your code does, not how it does it. Tests should remain valid even when internal implementation changes.

## Testing Rules

### 1. **Test behavior, not implementation details**

- Focus on the observable inputs and outputs of the system under test (SUT)
- Do not test private methods directly; test them through public interfaces
- Tests should remain valid even if internal implementation changes

### 2. **Write tests first (Test-Driven Development)**

- For new features, write the failing test before implementation
- Follow Red-Green-Refactor cycle: failing test → minimal implementation → improve code
- Let failing tests guide your API design and implementation

### 3. **Minimize mocking to essential dependencies**

- Only mock external systems you don't control (databases, APIs, file systems)
- Use real implementations of your own dependencies when possible
- If using a mock, it should represent realistic behavior of the real component

### 4. **Don't mock what you don't own**

- Create adapters around external dependencies instead of mocking them directly
- Mock your adapter interfaces, not third-party libraries
- This prevents your tests from breaking when third-party APIs change

### 5. **Create test doubles that accurately reflect real behavior**

- Stubs/mocks should follow the same contract as real implementations
- Test both happy paths and edge cases/error conditions
- Verify interactions with dependencies only when the interaction itself is the behavior being tested

### 6. **Use test fixtures intelligently**

- Set up controlled test environments rather than extensive mocking
- For filesystem operations, use temporary directories
- For databases, use in-memory databases or containers

### 7. **Test at the appropriate level**

- Unit tests: Test a single unit in isolation
- Integration tests: Test how components work together
- Clear distinction between unit and integration tests in organization

### 8. **Make tests deterministic and independent**

- Tests should not depend on each other
- Tests should be repeatable with the same results
- Avoid time-dependent tests; use fixed timestamps when necessary

### 9. **Write tests before fixing bugs**

- Create a test that reproduces the bug
- Fix the bug
- Verify the test passes

### 10. **Test for failure conditions**

- Verify error handling works correctly
- Test boundary conditions and edge cases
- Don't only test the "happy path"

### 11. **Keep tests simple and readable**

- Use descriptive test names that explain what's being tested and expected results
- Follow the AAA pattern: Arrange, Act, Assert
- One logical assertion per test (may include multiple related technical assertions)

### 12. **Tests should be maintainable**

- DRY principle applies to test code, but clarity is more important
- Tests should not be brittle (failing due to minor, unrelated changes)
- Tests should run quickly to encourage frequent running

### 13. **Measure test quality, not just coverage**

- Consider mutation testing to verify tests catch actual bugs
- Review tests as carefully as production code
- Ensure failing a test provides clear indication of what's wrong

### 14. **Test state changes, not just function calls**

- Verify the end state after operations, not just that methods were called
- Check actual data changes rather than implementation details

### 15. **Make tests obvious and transparent**

- A test should clearly show what it's testing without hidden complexity
- Someone not familiar with the code should understand what a test verifies

### 16. **Document test scenarios clearly**

- Tests should serve as documentation for how components should behave
- Use test names and structure to explain what's being tested and why
