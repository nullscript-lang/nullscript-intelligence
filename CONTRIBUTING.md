# Contributing to NullScript Intelligence

Thank you for your interest in contributing to the NullScript Intelligence VS Code extension! This guide will help you get started with development and contributing to the project.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16+ and npm
- **Visual Studio Code** 1.74.0 or higher
- **Git** for version control
- Basic knowledge of **TypeScript** and **VS Code Extension API**

### Development Setup

1. **Fork the Repository**

   Fork the repository on GitHub and clone your fork:

   ```bash
   git clone https://github.com/nullscript-lang/nullscript-intelligence.git
   cd nullscript-intelligence
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Compile TypeScript**

   ```bash
   # One-time compilation
   npm run compile

   # Watch mode for development
   npm run watch
   ```

4. **Run the Extension**

   - Open the project in VS Code
   - Press `F5` to start debugging
   - This opens a new Extension Development Host window
   - Create a `.ns` file to test the extension

## 📁 Project Structure

```
vscode-extension/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── keywords.ts           # NullScript keyword definitions
│   └── interface.ts          # TypeScript interfaces
├── snippets/
│   └── nullscript.json       # Code snippets
├── syntaxes/
│   └── nullscript.tmLanguage.json  # Syntax highlighting rules
├── images/                   # Extension icons
├── package.json              # Extension manifest
├── language-configuration.json    # Language configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Extension documentation
```

### Key Files Explained

- **`src/extension.ts`**: Contains the main extension logic including completion and hover providers
- **`src/keywords.ts`**: Defines all NullScript keywords with their JavaScript equivalents, descriptions, and examples
- **`src/interface.ts`**: TypeScript interfaces for type safety
- **`package.json`**: Extension manifest defining activation events, contributions, and metadata
- **`snippets/nullscript.json`**: Code snippets for common NullScript patterns

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

#### 🐛 Bug Fixes
- Fix auto-completion issues
- Resolve hover documentation problems
- Address syntax highlighting bugs
- Improve error handling

#### ✨ New Features
- Add support for new NullScript keywords
- Improve completion intelligence
- Enhance hover documentation
- Add new code snippets
- Create design pattern templates

#### 📚 Documentation
- Improve code comments and JSDoc
- Update README and guides
- Add usage examples
- Create tutorial content

#### 🧪 Testing
- Performance testing
- Cross-platform validation

### Development Workflow

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make Your Changes**

   - Follow the coding standards below
   - Add appropriate tests
   - Update documentation as needed

3. **Test Your Changes**

   ```bash
   # Compile and check for TypeScript errors
   npm run compile

   # Test manually in Extension Development Host
   # Press F5 in VS Code

   # Package to verify build
   npm run package
   ```

4. **Commit Your Changes**

   Use conventional commit messages:

   ```bash
   git add .
   git commit -m "feat: add completion for new keyword 'example'"
   # or
   git commit -m "fix: resolve hover documentation issue"
   # or
   git commit -m "docs: update contributing guidelines"
   ```

5. **Push and Create Pull Request**

   ```bash
   git push origin feature/your-feature-name
   ```

   Then create a pull request on GitHub with:
   - Clear description of changes
   - Screenshots or GIFs for UI changes
   - Reference to any related issues
   - Testing notes

## 📝 Coding Standards

### TypeScript Guidelines

```typescript
// Use meaningful names and proper typing
class NullScriptCompletionProvider implements vscode.CompletionItemProvider {

  // Add JSDoc comments for public methods
  /**
   * Provides completion items for NullScript keywords and methods
   * @param document The text document being edited
   * @param position The cursor position
   * @returns Promise of completion items array
   */
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.CompletionItem[]> {
    // Implementation here
  }

  // Use private methods for internal logic
  private getKeywordCompletions(): vscode.CompletionItem[] {
    // Implementation here
  }
}
```

### Code Style Rules

- **Indentation**: Use 2 spaces (not tabs)
- **Naming**: Use camelCase for variables and functions, PascalCase for classes
- **Comments**: Add JSDoc comments for public methods and interfaces
- **Error Handling**: Include proper try-catch blocks and error logging
- **Type Safety**: Use TypeScript types and avoid `any` when possible

### Adding New Keywords

When adding new NullScript keywords, follow this pattern in `src/keywords.ts`:

```typescript
{
  nullscript: "yournewkeyword",
  javascript: "javascriptequivalent",
  category: KeywordCategory.APPROPRIATE_CATEGORY,
  description: "Clear description of what this keyword does",
  syntax: "yournewkeyword (parameters) { ... }",
  example: "yournewkeyword (x > 5) { speak.say('Hello'); }"
}
```

### Adding Code Snippets

Add new snippets to `snippets/nullscript.json`:

```json
{
  "Your Snippet Name": {
    "prefix": "triggerkeyword",
    "body": [
      "line1 ${1:placeholder}",
      "line2 ${2:placeholder}",
      "    $0"
    ],
    "description": "Description of what this snippet does"
  }
}
```

### 🧪 Manual Testing Checklist

Before submitting a pull request, verify:

- [ ] Extension activates properly for `.ns` files
- [ ] Auto-completion works for your changes
- [ ] Hover documentation displays correctly
- [ ] Syntax highlighting is accurate
- [ ] No console errors in Extension Development Host
- [ ] Performance remains responsive
- [ ] Works across different VS Code themes

## 🐛 Debugging

### Common Issues

**Extension Not Activating**
- Check `activationEvents` in `package.json`
- Verify file has `.ns` extension
- Check for TypeScript compilation errors

**Completions Not Showing**
- Ensure language ID is set to "nullscript"
- Check completion provider registration
- Verify trigger characters are correct

**Hover Not Working**
- Ensure keyword exists in `KEYWORDS` array
- Check hover provider registration
- Verify word detection logic

### Debug Tools

- **VS Code Developer Tools**: `Help > Toggle Developer Tools`
- **Extension Host Console**: Check for runtime errors
- **Output Panel**: Select "NullScript Intelligence" from dropdown
- **Debug Console**: Use when running in debug mode

### Logging

Add temporary logging for debugging (remove before committing):

```typescript
console.log('Debug info:', variable);
```

## 📚 Resources

### VS Code Extension Development
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Language Extensions Guide](https://code.visualstudio.com/api/language-extensions/overview)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [VS Code Types](https://www.npmjs.com/package/@types/vscode)

### NullScript
- [NullScript Documentation](https://nullscript.js.org)
- [Keywords Reference](https://nullscript.js.org/reference/keywords)
- [Getting Started Guide](https://nullscript.js.org/guide/getting-started)

## 💬 Getting Help

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Request Reviews**: For code-related discussions

### Reporting Issues

When reporting bugs, please include:

1. **Environment Information**
   - VS Code version
   - Extension version
   - Operating system
   - Node.js version

2. **Steps to Reproduce**
   - Clear step-by-step instructions
   - Sample code that reproduces the issue
   - Expected vs actual behavior

3. **Additional Context**
   - Screenshots or screen recordings
   - Console error messages
   - Related extensions installed

## 📋 Pull Request Template

When creating a pull request, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
- [ ] Manual testing completed
- [ ] No console errors
- [ ] Cross-platform testing (if applicable)

## Screenshots/GIFs
(if applicable)

## Related Issues
Fixes #(issue number)
```

## 🎉 Recognition

Contributors will be:
- Listed in the project's contributors
- Mentioned in release notes for significant contributions
- Given credit in documentation they help improve

Thank you for contributing to NullScript Intelligence! Your efforts help make NullScript development more enjoyable for everyone. 🎭✨

---

**Questions?** Feel free to open an issue or start a discussion on GitHub!
