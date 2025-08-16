<div align="center">
  <img src="https://raw.githubusercontent.com/nullscript-lang/nullscript-intelligence/refs/heads/main/images/icon.png" alt="NullScript Logo" width="128" height="128">
  <h1 align="center">
    NullScript Intelligence
  </h1>

  <p align="center">
    Intelligent language support for NullScript in VS Code
  </p>

  <p align="center">
    <a href="https://marketplace.visualstudio.com/items?itemName=nullscript-lang.nullscript-intelligence">
      <img src="https://img.shields.io/visual-studio-marketplace/v/nullscript-lang.nullscript-intelligence?style=flat-square" alt="Latest Release">
    </a>
    <a href="https://github.com/nullscript-lang/nullscript/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/nullscript-lang/nullscript?style=flat-square" alt="License">
    </a>
  </p>

  <p align="center">
    <a href="https://nullscript.js.org">📚 Documentation</a>
    ·
    <a href="https://nullscript.js.org/examples/basic.html">💡 Examples</a>
    ·
    <a href="https://nullscript.js.org/reference/keywords.html">🔤 Keywords</a>
  </p>
</div>

> **The ultimate VS Code extension for NullScript development** - featuring intelligent auto-completion, contextual documentation, and beautiful syntax highlighting.

## ✨ Features

### 🚀 **Smart Auto-Completion**
- **Keyword suggestions** for all NullScript keywords and methods
- **Context-aware completions** for `speak.` and `clock.` methods
- **Import assistance** with module suggestions
- **Design pattern snippets** for common programming patterns

### 💡 **Rich Hover Documentation**
- **Comprehensive tooltips** with detailed explanations
- **JavaScript equivalents** showing how NullScript transpiles
- **Usage examples** and best practices
- **Performance hints** and category tips

### 🎨 **Beautiful Syntax Highlighting**
- **Full syntax support** for `.ns` files
- **Keyword highlighting** with distinct colors
- **String and comment support** with proper formatting
- **Bracket matching** and indentation guides

### 🔧 **Developer Experience**
- **Code snippets** for common patterns
- **Language configuration** with proper indentation
- **File association** for `.ns` files

## 🚀 Quick Start

### 1. Create Your First NullScript File

Create a new file with the `.ns` extension:

```javascript
// hello.ns
run greet(name) {
    speak.say(`Hello, ${name}!`);
    speak.log("Welcome to NullScript!");
}

greet("World");
```

### 2. Experience the Intelligence

- **Type `speak.`** - Get suggestions for console methods (`say`, `scream`, `yell`)
- **Type `clock.`** - Get suggestions for date methods (`now`, `parse`)
- **Hover over keywords** - See detailed documentation with examples
- **Use snippets** - Type `run`, `model`, `whatever`, etc. and press Tab


Learn more at [nullscript.js.org](https://nullscript.js.org/guide/vscode-extension.html)

## 🤝 Contributing

We welcome contributions to improve NullScript Intelligence! Here's how you can help:

### Quick Start for Contributors

1. **Fork the repository** on GitHub
2. **Clone your fork**: `git clone https://github.com/nullscript-lang/nullscript-intelligence.git`
3. **Install dependencies**: `npm install`
4. **Make your changes** to the extension code
5. **Test your changes**: Press F5 to run the extension in a new VS Code window
6. **Submit a pull request** with a clear description of your changes

### Areas We Need Help With

- 🐛 **Bug fixes** - Help us squash bugs and improve reliability
- ✨ **New features** - Add new keywords, snippets, or completion improvements
- 📚 **Documentation** - Improve READMEs, code comments, and user guides
- 🧪 **Testing** - Add tests for existing and new functionality
- 🎨 **UI/UX** - Improve hover documentation and completion presentation

For detailed contribution guidelines, see our [Contributing Guide](https://github.com/nullscript-lang/nullscript-intelligence/blob/main/CONTRIBUTING.md).

---

**Happy coding with NullScript! 🎭✨**

*Made with ❤️ by the NullScript Language Team*
