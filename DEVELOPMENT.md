# Development Workflow Guide

This project uses a comprehensive development workflow with automated code quality checks and CI/CD pipeline.

## 🛠️ Development Tools

### Husky + Lint-Staged

Automatically runs code quality checks before commits:

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Type checking**: TypeScript validation

### CommitLint

Enforces conventional commit message format:

```bash
# Valid commit formats:
feat: add new component
fix: resolve navigation issue
docs: update readme
style: improve button styling
refactor: optimize performance
test: add unit tests
build: update dependencies
ci: improve github actions
chore: update config files
```

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Husky will be automatically initialized** via the `prepare` script

3. **Start developing**:
   ```bash
   npm run dev
   ```

## 📝 Commit Workflow

1. **Make your changes**
2. **Stage files**:
   ```bash
   git add .
   ```
3. **Commit with conventional format**:
   ```bash
   git commit -m "feat: add user authentication"
   ```

The pre-commit hook will automatically:

- Run ESLint on staged files
- Format code with Prettier
- Check TypeScript types
- Fix any auto-fixable issues

## 🔍 Manual Commands

Run linting and formatting manually:

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Type check
npm run type-check

# Run lint-staged manually
npm run lint:staged
```

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Build application
npm run build
```

## 🌟 GitHub Actions

### CI Pipeline (`ci.yml`)

Runs on every push and pull request:

- **Lint and Test**: ESLint, Prettier, TypeScript, Unit tests, E2E tests
- **Build**: Application build verification
- **CommitLint**: Validates commit messages on PRs
- **Security Audit**: Checks for vulnerabilities

### Deployment (`deploy.yml`)

Deploys to production on main branch:

- Builds and tests the application
- Deploys to hosting platform (Netlify/Vercel/AWS)

### Auto Assignment (`auto-assign.yml`)

Automatically:

- Labels PRs based on changed files
- Assigns reviewers and assignees

## 📋 Pull Request Process

1. **Create feature branch**:

   ```bash
   git checkout -b feature/ECOM-123-new-feature
   ```

2. **Make changes and commit**:

   ```bash
   git commit -m "feat: implement new feature"
   ```

3. **Push branch**:

   ```bash
   git push origin feature/ECOM-123-new-feature
   ```

4. **Create Pull Request** using the provided template

5. **Review and merge** after CI passes

## 🏷️ Automatic Labeling

PRs are automatically labeled based on changed files:

- `frontend` - Source code changes
- `styling` - CSS/SCSS/Tailwind changes
- `components` - Component changes
- `tests` - Test file changes
- `documentation` - Markdown changes
- `config` - Configuration changes

## 🔧 Troubleshooting

### Commit message fails validation:

```bash
# Use conventional commit format
git commit -m "type: description"
```

### Pre-commit hook fails:

```bash
# Fix linting issues
npm run lint

# Fix formatting issues
npm run format

# Try committing again
git commit -m "fix: resolve linting issues"
```

### Husky not working:

```bash
# Reinstall husky
npm run prepare
```

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Lint-Staged](https://github.com/okonet/lint-staged)
