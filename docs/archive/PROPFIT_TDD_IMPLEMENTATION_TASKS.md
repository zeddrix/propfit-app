# PropFit TDD Implementation Tasks

## Overview

This document outlines the comprehensive Test-Driven Development (TDD) implementation of 12 specific tasks to enhance the PropFit rental property management application. Each task follows the TDD red-green-refactor cycle with specific acceptance criteria and implementation steps.

## Prerequisites

- Node.js 18+
- pnpm package manager
- VS Code with Svelte extension
- Browser with dev tools

## TDD Development Workflow

### 🔄 TDD Cycle for Each Task

1. **🔴 RED**: Write failing tests first
2. **🟢 GREEN**: Write minimal code to pass tests
3. **🔵 REFACTOR**: Improve code quality while keeping tests green
4. **✅ VERIFY**: Run full test suite and manual testing

### 📋 Development Commands Reference

```bash
# Development server (auto-reload enabled)
pnpm dev

# Testing
pnpm test              # Run unit tests
pnpm test:coverage     # Run tests with coverage
pnpm test:watch        # Run tests in watch mode

# Code Quality
pnpm lint              # Run linting
pnpm format            # Format code
pnpm check             # TypeScript type checking

# Build & Deploy
pnpm build             # Production build
pnpm preview           # Preview production build
```

## 📝 Task Implementation Plan

### Task 1: Editable Tenant Names

**Priority**: High | **Complexity**: Low | **Estimated Time**: 30 minutes

#### Acceptance Criteria

- [x] Tenant names are displayed in editable input fields
- [x] Changes persist in localStorage automatically
- [x] Input styling matches existing table design
- [x] Tab navigation works correctly
- [x] Empty names default to "New Tenant"

#### TDD Implementation Steps

1. **🔴 RED - Write Tests**

```bash
# Create test file
touch src/lib/components/TenantTable.test.ts
```

Test specifications:

- Tenant name renders in editable input field
- Typing in input field triggers update event
- Changes are saved to store automatically
- Input has proper accessibility attributes

2. **🟢 GREEN - Minimal Implementation**

- Replace text display with input field
- Add oninput event handler
- Wire to existing updateTenantField function

3. **🔵 REFACTOR - Improve**

- Add proper styling and focus states
- Implement accessibility features
- Add validation for empty names

---

### Task 2: Separate Unit Tables

**Priority**: High | **Complexity**: Medium | **Estimated Time**: 45 minutes

#### Unit Separation Criteria

- [x] Unit 1 (Franz) has separate table with heading "Unit 1 (2 pax) - studio type 1"
- [x] Unit 3 tenants have separate table with heading "Unit 3 (10 pax) - up/down"
- [x] Both tables maintain all existing functionality
- [x] Styling is consistent between tables
- [x] Add/Remove functionality only available for Unit 3

#### Unit Separation Implementation Steps

1. **🔴 RED - Write Tests**

- Test that tenants are grouped by unit correctly
- Test that Unit 1 table shows only Franz
- Test that Unit 3 table shows other tenants
- Test that both tables render with proper headings

2. **🟢 GREEN - Minimal Implementation**

- Add $derived for unit grouping
- Create separate table structures
- Move existing functionality to both tables

3. **🔵 REFACTOR - Improve**

- Extract reusable table components if needed
- Optimize grouping logic
- Ensure responsive design

---

### Task 3: 1000-Step Amount Input

**Priority**: Medium | **Complexity**: Low | **Estimated Time**: 20 minutes

#### Acceptance Criteria

- [x] Number inputs have step="1000" attribute
- [x] Up/down buttons increment/decrement by ₱1,000
- [x] Keyboard input still allows any value
- [x] Input validation prevents negative values
- [x] Cursor pointer on number input controls

#### TDD Implementation Steps

1. **🔴 RED - Write Tests**

- Test step attribute is set to 1000
- Test button clicks change value by 1000
- Test manual input still works
- Test minimum value constraint

2. **🟢 GREEN - Minimal Implementation**

- Add step="1000" attribute to inputs
- Verify existing min="0" constraint

3. **🔵 REFACTOR - Improve**

- Add CSS for better button styling
- Ensure cross-browser compatibility

---

### Task 4: Cursor Pointer on Buttons

**Priority**: Low | **Complexity**: Low | **Estimated Time**: 15 minutes

#### Acceptance Criteria

- [x] All buttons show pointer cursor on hover
- [x] Number input spin buttons show pointer cursor
- [x] Select dropdowns show pointer cursor
- [x] Date inputs show pointer cursor where appropriate
- [x] Consistent cursor behavior across app

#### TDD Implementation Steps

1. **🔴 RED - Write Tests**

- Test button elements have cursor pointer class
- Test interactive elements have proper cursor

2. **🟢 GREEN - Minimal Implementation**

- Add cursor-pointer class to all buttons
- Update CSS for input controls

3. **🔵 REFACTOR - Improve**

- Create utility classes for consistent styling
- Update global styles if needed

---

### Task 5: Mark All Paid Button

**Priority**: High | **Complexity**: Medium | **Estimated Time**: 30 minutes

#### Acceptance Criteria

- [x] "Mark All Paid" button at top of tenant section
- [x] Clicking fills all Amount Paid fields with rent amounts
- [x] Sets payment date to today's date for all tenants
- [x] Visual feedback when button is clicked
- [x] Undo functionality consideration

#### TDD Implementation Steps

1. **🔴 RED - Write Tests**

- Test button renders above tenant tables
- Test clicking button updates all tenant payments
- Test payment dates are set to today
- Test store updates correctly

2. **🟢 GREEN - Minimal Implementation**

- Add markAllPaid function to store
- Create button component
- Wire button to store function

3. **🔵 REFACTOR - Improve**

- Add loading state during update
- Consider confirmation dialog
- Add success feedback

---

### Task 6: Add/Remove Tenants with Undo Toast

**Priority**: High | **Complexity**: High | **Estimated Time**: 60 minutes

#### Acceptance Criteria

- [x] "Add Tenant" button only on Unit 3 table
- [x] "Remove" button on each Unit 3 tenant row
- [x] Removing tenant shows undo toast for 5 seconds
- [x] Undo restores tenant with all data
- [x] Toast dismisses after action or timeout
- [x] Proper rent recalculation after add/remove

#### TDD Implementation Steps

1. **🔴 RED - Write Tests**

- Test add tenant button adds new tenant to Unit 3
- Test remove button removes specific tenant
- Test undo toast appears after removal
- Test undo functionality restores tenant
- Test toast auto-dismisses after timeout

2. **🟢 GREEN - Minimal Implementation**

- Implement addTenant and removeTenant functions
- Create toast component with undo functionality
- Add timeout management

3. **🔵 REFACTOR - Improve**

- Improve toast positioning and animation
- Add better error handling
- Optimize undo state management

---

### Task 7: LocalStorage Integration

**Priority**: High | **Complexity**: Medium | **Estimated Time**: 45 minutes

#### Acceptance Criteria

- [x] All data changes persist to localStorage
- [x] Data loads from localStorage on app start
- [x] Browser compatibility checks for localStorage
- [x] Graceful fallback if localStorage unavailable
- [x] Clear localStorage option in reset function

#### TDD Implementation Steps

1. **🔴 RED - Write Tests**

- Test data persists to localStorage on changes
- Test data loads from localStorage on app start
- Test graceful fallback when localStorage unavailable
- Test reset clears localStorage

2. **🟢 GREEN - Minimal Implementation**

- Enhance existing store persistence
- Add error handling for localStorage operations
- Update reset function

3. **🔵 REFACTOR - Improve**

- Add data migration logic for version changes
- Implement compression for large data sets
- Add storage quota monitoring

---

### Task 8: Unit 3 Dynamic Rent Calculation

**Priority**: High | **Complexity**: Medium | **Estimated Time**: 40 minutes

#### Acceptance Criteria

- [x] Unit 3 total rent always equals ₱5,000
- [x] Rent splits equally among Unit 3 tenants
- [x] Adding tenant recalculates rent for all Unit 3 tenants
- [x] Removing tenant recalculates rent for all Unit 3 tenants
- [x] Display updates immediately on changes

#### TDD Implementation Steps

1. **🔴 RED - Write Tests**

- Test Unit 3 total rent equals 5000 regardless of tenant count
- Test rent splits equally among tenants
- Test adding tenant triggers recalculation
- Test removing tenant triggers recalculation

2. **🟢 GREEN - Minimal Implementation**

- Enhance existing updateUnit3Rents function
- Ensure all add/remove operations trigger recalculation
- Update display to show calculated rent

3. **🔵 REFACTOR - Improve**

- Add visual indicators for calculated vs fixed rent
- Optimize calculation performance
- Add rent calculation explanations

---

### Task 9: Development Performance Investigation

**Priority**: Medium | **Complexity**: Medium | **Estimated Time**: 45 minutes

#### Issues to Investigate

- [x] Hot module replacement not working
- [x] Large number of modules during build
- [x] Slow development server startup
- [x] Bundle size optimization

#### Investigation & Solution Steps

1. **🔍 ANALYSIS**

- Check Vite configuration
- Analyze dependency tree
- Review SvelteKit settings
- Test HMR functionality

2. **🔧 OPTIMIZATION**

- Configure Vite for better HMR
- Optimize imports and dependencies
- Review build pipeline
- Update development scripts

3. **📊 VALIDATION**

- Measure build performance improvements
- Test HMR functionality
- Document configuration changes

---

### Task 10: Lint Error Resolution

**Priority**: Medium | **Complexity**: Low | **Estimated Time**: 30 minutes

#### Acceptance Criteria

- [x] All ESLint errors resolved
- [x] All Prettier formatting issues fixed
- [x] TypeScript compilation errors resolved
- [x] Import/export statements properly formatted
- [x] Consistent code style throughout project

#### Implementation Steps

1. **🔍 IDENTIFY**

- Run comprehensive linting
- Categorize error types
- Priority order for fixes

2. **🔧 FIX**

- Resolve each error systematically
- Update ESLint config if needed
- Fix TypeScript type issues

3. **✅ VALIDATE**

- Ensure all tests still pass
- Verify application functionality
- Run full lint check

---

### Task 11: Documentation Updates

**Priority**: Low | **Complexity**: Low | **Estimated Time**: 30 minutes

#### Files to Update

- [x] README.md - Add new features
- [x] PROPFIT_APP_IMPLEMENTATION_PLAN.md - Mark completed tasks
- [x] unit-testing-rules.md - Add TDD guidelines

#### Update Requirements

- [x] Feature descriptions match implementation
- [x] Screenshots updated if needed
- [x] API documentation current
- [x] Installation/setup instructions current

---

### Task 12: Development Guidelines Documentation

**Priority**: Low | **Complexity**: Low | **Estimated Time**: 20 minutes

#### Guidelines to Document

- [x] TDD workflow for future features
- [x] Testing commands and best practices
- [x] Git workflow and commit conventions
- [x] Code review checklist
- [x] Performance monitoring guidelines

## 🎯 Implementation Order

### Phase 1: Core Functionality (High Priority)

1. Task 2: Separate Unit Tables (45 min)
2. Task 1: Editable Tenant Names (30 min)
3. Task 8: Unit 3 Dynamic Rent Calculation (40 min)
4. Task 7: LocalStorage Integration (45 min)
5. Task 6: Add/Remove Tenants with Undo (60 min)

### Phase 2: User Experience (Medium Priority)

6. Task 5: Mark All Paid Button (30 min)
7. Task 3: 1000-Step Amount Input (20 min)
8. Task 9: Development Performance (45 min)
9. Task 10: Lint Error Resolution (30 min)

### Phase 3: Polish & Documentation (Low Priority)

10. Task 4: Cursor Pointer Styling (15 min)
11. Task 11: Documentation Updates (30 min)
12. Task 12: Development Guidelines (20 min)

## 📊 Progress Tracking

### Completion Checklist

- [x] **Phase 1 Complete** - Core Functionality
- [x] **Phase 2 Complete** - User Experience
- [x] **Phase 3 Complete** - Polish & Documentation
- [x] **Full Test Suite Passing**
- [x] **Production Build Successful**
- [x] **Documentation Updated**

### Quality Gates

- [x] All tests passing (minimum 90% coverage)
- [x] No linting errors
- [x] TypeScript compilation successful
- [x] Performance benchmarks met
- [x] Manual testing completed

## 🚀 Getting Started

### Step 1: Setup Development Environment

```bash
# Ensure dependencies are installed
pnpm install

# Start development server
pnpm dev

# Run test watcher in separate terminal
pnpm test:watch
```

### Step 2: Begin TDD Cycle

1. Choose next task from Phase 1
2. Follow TDD red-green-refactor cycle
3. Run tests frequently during development
4. Manual test each feature before moving on

### Step 3: Commit Strategy

```bash
# Commit after each completed task
git add .
git commit -m "feat: implement [task description] with TDD approach"

# Push regularly to backup work
git push origin main
```

## 📚 Additional Resources

- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Vitest Testing Framework](https://vitest.dev/)
- [TailwindCSS v4](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Note**: This implementation plan follows strict TDD principles. Each feature must have tests written first, then implementation, then refactoring. This ensures high code quality and maintainable codebase.
