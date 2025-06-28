# Testing Guide for SentinelAI

This document provides comprehensive information about the testing setup and practices for both the backend and frontend of the SentinelAI project.

## Overview

The project uses a comprehensive testing strategy with:
- **Backend**: pytest with nox for Python testing
- **Frontend**: Jest and React Testing Library for JavaScript/TypeScript testing
- **API Mocking**: MSW (Mock Service Worker) for frontend API testing
- **Coverage**: Code coverage reporting for both backend and frontend

## Backend Testing

### Setup

The backend uses pytest as the primary testing framework with additional tools:

- **pytest**: Main testing framework
- **pytest-asyncio**: For testing async code
- **pytest-cov**: Coverage reporting
- **pytest-mock**: Mocking utilities
- **nox**: Test automation and environment management
- **httpx**: HTTP client for API testing
- **factory-boy**: Test data generation
- **faker**: Fake data generation

### Installation

```bash
cd backend
pip install -r requirements-dev.txt
```

### Running Tests

#### Using pytest directly:
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_api_policies.py

# Run tests with specific markers
pytest -m unit
pytest -m integration
pytest -m api
```

#### Using nox (recommended):
```bash
# Run all test sessions
nox

# Run only tests
nox -s tests

# Run tests for specific Python version
nox -s tests-3.11

# Run linting
nox -s lint

# Run type checking
nox -s type_check

# Format code
nox -s format
```

### Test Structure

```
backend/tests/
├── __init__.py
├── conftest.py              # Pytest configuration and fixtures
├── test_main.py            # Main application tests
├── test_api_policies.py    # Policy API endpoint tests
├── test_models.py          # Database model tests
└── ...
```

### Key Testing Features

#### Fixtures (conftest.py)
- `db_engine`: Test database engine
- `db_session`: Fresh database session for each test
- `client`: FastAPI test client with database override
- `sample_policy_data`: Sample policy data for testing
- `sample_event_data`: Sample event data for testing
- `sample_violation_data`: Sample violation data for testing

#### Test Markers
- `@pytest.mark.unit`: Unit tests
- `@pytest.mark.integration`: Integration tests
- `@pytest.mark.api`: API endpoint tests
- `@pytest.mark.slow`: Slow running tests
- `@pytest.mark.database`: Tests requiring database

#### Example Test
```python
@pytest.mark.api
def test_create_policy(client, sample_policy_data):
    """Test creating a new policy."""
    response = client.post("/api/policies/", json=sample_policy_data)
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["name"] == sample_policy_data["name"]
    assert "id" in data
```

### Configuration Files

- `pytest.ini`: Pytest configuration
- `noxfile.py`: Nox session definitions
- `pyproject.toml`: Tool configurations (black, isort, mypy, coverage)
- `.flake8`: Flake8 linting configuration

## Frontend Testing

### Setup

The frontend uses Jest and React Testing Library:

- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing utilities
- **MSW**: API mocking
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers

### Installation

```bash
cd frontend
npm install
```

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Debug tests
npm run test:debug
```

### Test Structure

```
frontend/src/
├── components/
│   └── __tests__/
│       ├── Dashboard.test.tsx
│       ├── Policies.test.tsx
│       └── ...
├── services/
│   └── __tests__/
│       └── api.test.ts
├── mocks/
│   ├── handlers.ts          # MSW request handlers
│   └── server.ts           # MSW server setup
├── setupTests.ts           # Test setup and configuration
└── App.test.tsx
```

### Key Testing Features

#### MSW (Mock Service Worker)
API mocking for realistic testing without actual API calls:

```typescript
// handlers.ts
export const handlers = [
  http.get('/api/policies/', () => {
    return HttpResponse.json(mockPolicies);
  }),
  // ... more handlers
];
```

#### Component Testing Example
```typescript
describe('Dashboard Component', () => {
  test('displays stats cards after loading', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Policies')).toBeInTheDocument();
    });

    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
```

#### User Interaction Testing
```typescript
test('handles delete policy action', async () => {
  const user = userEvent.setup();
  render(<Policies />);
  
  const deleteButton = screen.getByRole('button', { name: /delete/i });
  await user.click(deleteButton);
  
  expect(mockApiService.deletePolicy).toHaveBeenCalled();
});
```

### Configuration

#### Jest Configuration (package.json)
```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/index.tsx",
      "!src/reportWebVitals.ts"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

## Testing Best Practices

### General Principles

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **Arrange, Act, Assert**: Structure tests clearly
3. **Descriptive Test Names**: Use clear, descriptive test names
4. **Independent Tests**: Each test should be independent and isolated
5. **Mock External Dependencies**: Mock APIs, databases, and external services

### Backend Best Practices

1. **Use Fixtures**: Leverage pytest fixtures for common test data
2. **Test Database Isolation**: Each test gets a fresh database session
3. **Test Error Cases**: Include tests for error conditions and edge cases
4. **Use Markers**: Organize tests with pytest markers
5. **Test API Contracts**: Verify request/response formats

### Frontend Best Practices

1. **Test User Interactions**: Focus on how users interact with components
2. **Mock API Calls**: Use MSW for consistent API mocking
3. **Test Accessibility**: Include accessibility testing where relevant
4. **Avoid Implementation Details**: Don't test internal component state
5. **Test Error States**: Include tests for loading and error states

## Coverage Requirements

### Backend
- Minimum 80% code coverage
- Coverage reports generated in HTML and XML formats
- Excludes test files and migrations

### Frontend
- Minimum 70% coverage for branches, functions, lines, and statements
- Excludes type definitions and entry points

## Continuous Integration

### Backend CI Pipeline
```bash
# Install dependencies
pip install -r requirements.txt -r requirements-dev.txt

# Run tests with coverage
nox -s tests

# Run linting
nox -s lint

# Run type checking
nox -s type_check
```

### Frontend CI Pipeline
```bash
# Install dependencies
npm ci

# Run tests with coverage
npm run test:ci

# Build application
npm run build
```

## Debugging Tests

### Backend Debugging
```bash
# Run specific test with verbose output
pytest -v tests/test_api_policies.py::test_create_policy

# Run with pdb debugger
pytest --pdb tests/test_api_policies.py

# Run with coverage and HTML report
pytest --cov=app --cov-report=html
```

### Frontend Debugging
```bash
# Debug specific test
npm run test:debug -- --testNamePattern="Dashboard"

# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test Dashboard.test.tsx
```

## Common Issues and Solutions

### Backend Issues

1. **Database Connection Errors**: Ensure test database is properly configured
2. **Import Errors**: Check Python path and module imports
3. **Async Test Issues**: Use `pytest-asyncio` for async tests

### Frontend Issues

1. **MSW Not Working**: Ensure server is started in setupTests.ts
2. **Component Not Rendering**: Check for missing providers or context
3. **Async Test Failures**: Use `waitFor` for async operations

## Adding New Tests

### Backend Test Template
```python
import pytest
from fastapi import status

@pytest.mark.api
def test_new_endpoint(client, sample_data):
    """Test description."""
    # Arrange
    # ... setup test data
    
    # Act
    response = client.post("/api/endpoint/", json=sample_data)
    
    # Assert
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["field"] == expected_value
```

### Frontend Test Template
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Component from '../Component';

describe('Component', () => {
  test('should do something', async () => {
    // Arrange
    render(<Component />);
    
    // Act
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Expected text')).toBeInTheDocument();
    });
  });
});
```

## Resources

- [pytest Documentation](https://docs.pytest.org/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [nox Documentation](https://nox.thea.codes/)
