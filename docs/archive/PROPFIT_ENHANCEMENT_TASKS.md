# PropFit App Enhancement Tasks - TDD Implementation

## Overview

This document outlines the comprehensive enhancement tasks for the PropFit rental property management application. Each task will be implemented using Test-Driven Development (TDD) approach with specific acceptance criteria and implementation steps.

## Task 1: Fix PDF Export AutoTable Error

### Problem

The PDF export functionality is failing with the error:

```
Uncaught TypeError: doc.autoTable is not a function
```

### Root Cause Analysis

The `jspdf-autotable` plugin is not properly imported or initialized in the exportPdf.ts file.

### Acceptance Criteria

- [ ] PDF export functionality works without errors
- [ ] AutoTable plugin is properly imported and configured
- [ ] PDF generates with properly formatted tables for tenants, expenses, and shareholders
- [ ] All data is correctly displayed in the PDF output
- [ ] Error handling is implemented for PDF generation failures

### Test Cases

1. Test PDF export with valid data
2. Test PDF export with empty data
3. Test PDF export with maximum data
4. Test error handling for invalid data

### Implementation Steps

1. Write failing tests for PDF export functionality
2. Fix the jspdf-autotable import and initialization
3. Ensure all table data is properly formatted for PDF
4. Implement proper error handling
5. Verify all tests pass

## Task 2: Fix TypeScript Property Errors in +page.svelte

### Problem

TypeScript errors for unknown properties in component props:

- `onupdateTenant` does not exist in TenantTable Props
- `onupdateExpense` does not exist in ExpenseTable Props
- `onreset` does not exist in ActionButtons Props

### Root Cause Analysis

Component type definitions are missing or incorrect for custom event handlers.

### Acceptance Criteria

- [ ] All TypeScript errors are resolved
- [ ] Component props are properly typed
- [ ] Custom events are correctly defined in component interfaces
- [ ] Type safety is maintained throughout the application
- [ ] No TypeScript compilation errors

### Test Cases

1. Test component prop type definitions
2. Test custom event handler types
3. Test TypeScript compilation without errors
4. Test component functionality with proper typing

### Implementation Steps

1. Write tests for component type definitions
2. Update component type definitions to include custom event handlers
3. Ensure proper typing for all custom events
4. Verify TypeScript compilation passes
5. Test component functionality

## Task 3: Implement Unit 2 Studio Type Table with Rental Logic

### Problem

Need to create a new rental unit table with specific payment logic and migrate tenants from Unit 3.

### Detailed Requirements

#### Unit 2 Specifications

- **Name**: "Unit 2 (6 pax) - studio type 2"
- **Minimum Unit Rent**: P2,000/month (regardless of occupancy)
- **Maximum Occupancy**: 6 persons
- **Maximum Unit Rent**: P6,000/month

#### Payment Logic

- **1 person**: Pays P2,000/month (full minimum)
- **2 persons**: Pay P1,000/month each (P2,000 total)
- **3+ persons**: Pay P1,000/month each
- **Maximum**: 6 persons × P1,000 = P6,000/month

#### Data Migration

- Move existing tenants from "Unit 3 (10 pax) - up/down" to Unit 2
- Unit 3 table becomes empty but retains its logic
- Implement empty state UI for all tables

### Acceptance Criteria

- [ ] Unit 2 table is created with proper payment calculations
- [ ] Payment logic correctly enforces minimum P2,000 and calculates per-person rates
- [ ] Tenant data is successfully migrated from Unit 3 to Unit 2
- [ ] Unit 3 table shows appropriate empty state
- [ ] Empty state UI is implemented for all tables
- [ ] All calculations update correctly with new unit structure
- [ ] Data persistence works with new unit structure

### Test Cases

1. Test Unit 2 payment calculation with 1 person (P2,000)
2. Test Unit 2 payment calculation with 2 persons (P1,000 each)
3. Test Unit 2 payment calculation with 3-6 persons (P1,000 each)
4. Test tenant migration from Unit 3 to Unit 2
5. Test empty state display for Unit 3
6. Test maximum occupancy enforcement (6 persons max)
7. Test total rent calculations with new unit structure

### Implementation Steps

1. Write failing tests for Unit 2 payment logic
2. Update data types to include Unit 2 structure
3. Implement Unit 2 component with payment calculations
4. Create tenant migration functionality
5. Implement empty state UI component
6. Update stores and state management
7. Verify all tests pass

## Task 4: Add Information Tooltips for Table Headers

### Problem

Users need clear understanding of each table's rental logic and rules.

### Detailed Requirements

#### Tooltip Content

- **Unit 2 (6 pax) - studio type 2**:
  "Min unit rent: P2,000/month | Min rent/person (2+ occupants): P1,000/month | Max occupancy: 6 persons | Max unit rent: P6,000/month"
- **Unit 3 (10 pax) - up/down**:
  "Min rent/person: P1,000/month | Max occupancy: 10 persons | Max unit rent: P10,000/month"
- **Expenses Table**:
  "Track monthly property expenses including utilities, maintenance, and other costs"
- **Profit Distribution**:
  "Net income distribution among shareholders based on their ownership percentages"

#### UI Requirements

- Information icon (ℹ️) next to each table heading
- Tooltip appears on hover
- Tooltip disappears when mouse leaves
- Responsive design for mobile devices
- Accessible implementation (keyboard navigation, screen readers)

### Acceptance Criteria

- [ ] Information icons are visible next to all table headings
- [ ] Tooltips display correct information for each table
- [ ] Hover behavior works correctly
- [ ] Tooltips are responsive and accessible
- [ ] Clean, professional visual design
- [ ] No layout disruption when tooltips appear

### Test Cases

1. Test tooltip content accuracy for each table
2. Test hover show/hide behavior
3. Test accessibility features (keyboard navigation, ARIA labels)
4. Test responsive behavior on different screen sizes
5. Test tooltip positioning and visual appearance

### Implementation Steps

1. Write tests for tooltip functionality
2. Create reusable Tooltip component
3. Add information icons to table headers
4. Implement hover behavior and positioning
5. Add accessibility features
6. Style tooltips for consistent design
7. Verify all tests pass

## Task 5: Create Navigation Bar Component

### Problem

Action buttons need better organization and the app needs a proper navigation structure.

### Detailed Requirements

#### Navigation Bar Features

- **Logo/App Title**: "PropFit" or "Rental Property Management"
- **Action Buttons**: Export PDF, Export Excel, Print, Reset Data
- **Responsive Design**: Mobile-friendly hamburger menu if needed
- **Sticky/Fixed Position**: Always visible at top of page

#### Design Considerations

- Clean, professional appearance
- Consistent with existing design system
- Proper spacing and alignment
- Accessible navigation
- Print-friendly (hidden in print mode)

#### Alternative Placement

If navigation bar doesn't work well visually, consider:

- Floating action button group
- Sidebar panel
- Header section with better organization

### Acceptance Criteria

- [ ] Navigation bar component is created and functional
- [ ] All action buttons are moved to navigation
- [ ] Responsive design works on all screen sizes
- [ ] Navigation is accessible and keyboard-navigable
- [ ] Visual design is clean and professional
- [ ] Print styles hide navigation appropriately
- [ ] No functionality is lost in the migration

### Test Cases

1. Test navigation bar rendering and functionality
2. Test action button functionality in new location
3. Test responsive behavior
4. Test accessibility features
5. Test print mode (navigation hidden)

### Implementation Steps

1. Write tests for navigation component
2. Create NavigationBar component
3. Move ActionButtons functionality to navigation
4. Implement responsive design
5. Add accessibility features
6. Update main page layout
7. Verify all tests pass

## Task 6: Add "Prepared by" Field with Shareholder Dropdown

### Problem

Need to track who prepared each monthly report for accountability and record-keeping.

### Detailed Requirements

#### Field Specifications

- **Position**: Below the Month selector field
- **Label**: "Prepared by"
- **Type**: Dropdown/Select input
- **Options**: Names of all shareholders from the shareholders store
- **Default**: First shareholder or empty selection
- **Persistence**: Value should be saved with monthly data

#### Integration Requirements

- Integrate with existing month selection UI
- Include in PDF/Excel exports
- Save to localStorage with other monthly data
- Display in summary reports

### Acceptance Criteria

- [ ] "Prepared by" dropdown is added below Month field
- [ ] Dropdown is populated with shareholder names
- [ ] Selected value is saved and persists
- [ ] Field is included in PDF/Excel exports
- [ ] Proper validation and error handling
- [ ] Consistent styling with existing form elements

### Test Cases

1. Test dropdown population with shareholder names
2. Test value selection and persistence
3. Test integration with monthly data
4. Test inclusion in exports (PDF/Excel)
5. Test validation and error handling

### Implementation Steps

1. Write tests for "Prepared by" functionality
2. Update data types to include preparedBy field
3. Add dropdown component to main page
4. Implement data persistence
5. Update export functions to include preparedBy
6. Style consistently with existing UI
7. Verify all tests pass

## Implementation Order

1. **Task 2**: Fix TypeScript errors (foundation for other tasks)
2. **Task 1**: Fix PDF export (critical functionality)
3. **Task 6**: Add "Prepared by" field (simple addition)
4. **Task 3**: Implement Unit 2 table (major feature)
5. **Task 4**: Add information tooltips (UX enhancement)
6. **Task 5**: Create navigation bar (UI restructuring)

## Testing Strategy

### Unit Tests

- Individual component functionality
- Data calculation logic
- State management
- Type safety

### Integration Tests

- Component interactions
- Data flow between components
- Export functionality
- User workflows

### Visual Tests

- Component rendering
- Responsive design
- Tooltip positioning
- Print styles

### Accessibility Tests

- Keyboard navigation
- Screen reader compatibility
- ARIA labels and roles
- Color contrast

## Success Criteria

All tasks completed with:

- ✅ No TypeScript compilation errors
- ✅ All tests passing (unit, integration, visual)
- ✅ Full functionality maintained
- ✅ Enhanced user experience
- ✅ Proper documentation
- ✅ Accessibility compliance
- ✅ Responsive design
- ✅ Clean, maintainable code
