# Test Report

## Test run

Date: 2026-10-25
Code revision: `1026623a28d75fdac0226c7b73225d02712774d6`

This revision identifies the application code tested before the
final documentation commit.

## Results

| Check | Result |
|---|---|
| Backend pytest suite | 56 passed, 1 warning; 9.72 seconds |
| Frontend Vitest suite | 12 passed across 3 test files |
| Frontend production build | Successful; 26 modules transformed |

## Commands

From `backend/`, with its virtual environment active:

```bash
python -m pytest -q
```

From `frontend/`:

```bash
npm test
npm run build
```

## Raw evidence

- [Backend output](test-results/backend.txt)
- [Frontend output](test-results/frontend.txt)
- [Production build output](test-results/frontend-build.txt)
- [Environment](test-results/environment.txt)
- [Revision](test-results/revision.txt)

## Frontend test scope

- VehicleCard: 6 tests for identity/stock display, purchase callback,
  zero-stock behavior, role-based controls, and busy state.
- VehicleImage: 3 tests for photograph rendering, hero loading behavior,
  and SVG fallback.
- LandingPage: 3 tests for the main heading, sign-in callback,
  and collection navigation.

These are component tests, not an end-to-end browser suite.

## Backend warning

The backend run reported a Starlette TestClient/HTTPX deprecation warning.
It did not fail the suite. Dependency compatibility should be reviewed
before a future upgrade rather than changed without regression testing.

## Coverage

Coverage was not measured in this recorded run.
No coverage percentage is claimed.

## Manual acceptance checks

See [manual-checklist.md](manual-checklist.md).
Only checked items represent checks actually performed by the author.

## Limitations

Passing these suites does not establish production readiness,
complete accessibility compliance, or correctness of every browser workflow.
External photograph availability also depends on the network and host.
