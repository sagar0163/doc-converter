# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |
| 1.x     | :x: (not yet released) |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to the maintainer.
We will respond within 24 hours.

## Security Checks

This project runs supply-chain security scans on every build — both in CI (see `.github/workflows/ci.yml`) and as a dedicated audit stage in the Dockerfile. Both run `npm audit` against the full dependency tree and fail the build if any high-severity vulnerability is found:

```bash
# Run security audit (full dependency tree, fails on high-severity findings)
npm audit --audit-level=high
```

## Best Practices

1. Keep dependencies updated
2. Validate all user input
3. Sanitize file uploads
4. Use secure headers (when an HTTP service is ever added)
5. Implement rate limiting (when an HTTP service is ever added)