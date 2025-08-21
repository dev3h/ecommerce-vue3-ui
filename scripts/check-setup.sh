#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Checking development environment setup...${NC}\n"

# Check if Husky is installed
if [ -d ".husky" ]; then
    echo -e "${GREEN}✅ Husky is installed${NC}"
else
    echo -e "${RED}❌ Husky is not installed${NC}"
fi

# Check if pre-commit hook exists
if [ -f ".husky/pre-commit" ]; then
    echo -e "${GREEN}✅ Pre-commit hook exists${NC}"
else
    echo -e "${RED}❌ Pre-commit hook missing${NC}"
fi

# Check if commit-msg hook exists
if [ -f ".husky/commit-msg" ]; then
    echo -e "${GREEN}✅ Commit-msg hook exists${NC}"
else
    echo -e "${RED}❌ Commit-msg hook missing${NC}"
fi

# Check if lint-staged config exists
if [ -f ".lintstagedrc.json" ]; then
    echo -e "${GREEN}✅ Lint-staged config exists${NC}"
else
    echo -e "${RED}❌ Lint-staged config missing${NC}"
fi

# Check if commitlint config exists
if [ -f "commitlint.config.js" ]; then
    echo -e "${GREEN}✅ Commitlint config exists${NC}"
else
    echo -e "${RED}❌ Commitlint config missing${NC}"
fi

# Check if GitHub Actions exist
if [ -d ".github/workflows" ]; then
    echo -e "${GREEN}✅ GitHub Actions configured${NC}"
    echo "   Workflows:"
    for workflow in .github/workflows/*.yml; do
        if [ -f "$workflow" ]; then
            echo "   - $(basename "$workflow")"
        fi
    done
else
    echo -e "${RED}❌ GitHub Actions not configured${NC}"
fi

echo -e "\n${YELLOW}🧪 Testing tools...${NC}"

# Test ESLint
echo -n "Testing ESLint... "
if npm run lint --silent > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

# Test Prettier
echo -n "Testing Prettier... "
if npm run format -- --check --silent > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️ (files need formatting)${NC}"
fi

# Test TypeScript
echo -n "Testing TypeScript... "
if npm run type-check --silent > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

# Test commit message format
echo -n "Testing CommitLint... "
if echo "feat: test commit message" | npx commitlint --silent > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

echo -e "\n${GREEN}🎉 Setup verification complete!${NC}"
echo -e "\n${YELLOW}📚 Next steps:${NC}"
echo "1. Make sure all team members run: npm install"
echo "2. Commit your changes with conventional format: git commit -m 'feat: setup development workflow'"
echo "3. Push to trigger GitHub Actions"
echo "4. Review DEVELOPMENT.md for detailed workflow guide"
