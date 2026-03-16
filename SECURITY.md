# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to the maintainer.
We will respond within 24 hours.

## Security Checks

This project includes security scanning in CI:

```bash
# Run security audit
npm audit

# Run dependency check
npm audit fix
```

## Best Practices

1. Keep dependencies updated
2. Validate all user input
3. Sanitize file uploads
4. Use secure headers
5. Implement rate limiting
