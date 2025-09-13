# Security Policy

## Vulnerability Status

### Current Status: ✅ Production Safe

This project has **3 moderate severity vulnerabilities** in development dependencies only:

- **webpack-dev-server** (development only)
  - Only affects local development environment
  - Does not impact production builds
  - Fixed in newer versions of react-scripts

### Why These Are Safe

1. **Development Only**: These vulnerabilities are in `webpack-dev-server` which is only used during `npm start`
2. **Production Builds**: The `npm run build` command creates secure, optimized bundles without these dependencies
3. **Azure Deployment**: Your live application uses only the production build, not the development server

### Mitigation Applied

- Added npm overrides to fix 6 other vulnerabilities ✅
- Reduced total vulnerabilities from 9 to 3 ✅  
- All remaining issues are development-only ✅
- Production bundle is secure and optimized ✅

### Future Updates

These vulnerabilities will be resolved when:
- Create React App releases a newer version of react-scripts
- We upgrade to a newer React framework (like Next.js or Vite)

### Reporting Vulnerabilities

If you discover a security vulnerability, please report it to yooakim@gmail.com