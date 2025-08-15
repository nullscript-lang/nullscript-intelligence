import * as vscode from "vscode";
import { KeywordMapping } from "./interface";
import { KEYWORDS } from "./keywords";

export function activate(context: vscode.ExtensionContext) {
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: "nullscript" },
    new NullScriptCompletionProvider(),
    ".",
    " ",
    "(",
  );

  const hoverProvider = vscode.languages.registerHoverProvider(
    {
      language: "nullscript",
      scheme: "file",
    },
    new NullScriptHoverProvider(),
  );

  context.subscriptions.push(completionProvider, hoverProvider);
}

class NullScriptCompletionProvider implements vscode.CompletionItemProvider {
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext,
  ): Promise<vscode.CompletionItem[] | undefined> {
    try {
      const config = vscode.workspace.getConfiguration("nullscript");
      const enabled = config.get<boolean>("completion.enabled", true);

      if (!enabled) {
        return undefined;
      }

      const lineText = document.lineAt(position).text;
      const beforeCursor = lineText.substring(0, position.character);

      if (beforeCursor.endsWith("speak.")) {
        return this.getSpeakMethodCompletions();
      }

      if (beforeCursor.endsWith("clock.")) {
        return this.getClockMethodCompletions();
      }

      if (beforeCursor.includes("use ") || beforeCursor.endsWith("from ")) {
        return this.getImportCompletions(document, position, beforeCursor);
      }

      const builtInCompletions = this.getBuiltInCompletions();
      const patternCompletions = this.getPatternCompletions();

      return [...builtInCompletions, ...patternCompletions];
    } catch (error) {
      console.error("NullScript completion error:", error);
      return undefined;
    }
  }

  private getBuiltInCompletions(): vscode.CompletionItem[] {
    return KEYWORDS.filter(
      (keyword: KeywordMapping) => keyword && keyword.nullscript,
    ).map((keyword: KeywordMapping) => {
      const completion = new vscode.CompletionItem(
        keyword.nullscript,
        this.getCompletionKind(keyword.category || ""),
      );

      completion.detail = keyword.description || "";
      completion.documentation = new vscode.MarkdownString(
        `**${keyword.nullscript}** - ${keyword.description || ""}\n\n` +
          `**JavaScript Equivalent:** \`${keyword.javascript || ""}\`\n\n` +
          (keyword.syntax
            ? `**Syntax:**\n\`\`\`nullscript\n${keyword.syntax}\n\`\`\`\n\n`
            : "") +
          (keyword.example
            ? `**Example:**\n\`\`\`nullscript\n${keyword.example}\n\`\`\``
            : ""),
      );

      const snippet = this.getSnippetForKeyword(keyword.nullscript);
      if (snippet) {
        completion.insertText = new vscode.SnippetString(snippet);
      }

      return completion;
    });
  }

  private getCompletionKind(category: string): vscode.CompletionItemKind {
    if (!category || typeof category !== "string") {
      return vscode.CompletionItemKind.Keyword;
    }

    const kindMap: { [key: string]: vscode.CompletionItemKind } = {
      "Control Flow": vscode.CompletionItemKind.Keyword,
      "Variables & Declarations": vscode.CompletionItemKind.Keyword,
      "Functions & Methods": vscode.CompletionItemKind.Function,
      Operators: vscode.CompletionItemKind.Operator,
      "Types & Classes": vscode.CompletionItemKind.Class,
      "Console Methods": vscode.CompletionItemKind.Method,
      "Global Objects": vscode.CompletionItemKind.Class,
      "Global Functions": vscode.CompletionItemKind.Function,
      "Timing Functions": vscode.CompletionItemKind.Function,
      "Boolean Values": vscode.CompletionItemKind.Value,
      "Modules & Imports": vscode.CompletionItemKind.Keyword,
      "Error Handling": vscode.CompletionItemKind.Keyword,
      "Object-Oriented": vscode.CompletionItemKind.Keyword,
      "Async/Await": vscode.CompletionItemKind.Keyword,
      Utility: vscode.CompletionItemKind.Function,
    };

    return kindMap[category] || vscode.CompletionItemKind.Keyword;
  }

  private getSnippetForKeyword(keyword: string): string | undefined {
    const snippets: { [key: string]: string } = {
      run: "run ${1:functionName}(${2:params}) {\n\t$0\n}",
      whatever: "whatever (${1:condition}) {\n\t$0\n}",
      since:
        "since (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t$0\n}",
      when: "when (${1:condition}) {\n\t$0\n}",
      fixed: "fixed ${1:name} = ${2:value};",
      let: "let ${1:name} = ${2:value};",
      share: "share { ${1:exports} };",
      use: "use { ${1:imports} } from '${2:module}';",
      test: "test {\n\t${1:// code that might throw}\n} grab (${2:error}) {\n\t${3:// handle error}\n}",
      model:
        "model ${1:ClassName} {\n\t__init__(${2:params}) {\n\t\t${3:// constructor code}\n\t}\n\t$0\n}",
      later: "run later ${1:functionName}() {\n\t${2:// async code}\n\t$0\n}",
      speak: "speak.",
      clock: "clock()",
    };

    return snippets[keyword];
  }

  private getPatternCompletions(): vscode.CompletionItem[] {
    const patterns = [
      {
        label: "observer-pattern",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "Observer Design Pattern",
        documentation: "Creates a complete Observer pattern implementation",
        insertText:
          "model ${1:Subject} {\n\t__init__() {\n\t\tthis.observers = [];\n\t}\n\n\taddObserver(observer) {\n\t\tthis.observers.push(observer);\n\t}\n\n\tnotifyObservers(data) {\n\t\tthis.observers.forEach(observer => observer.update(data));\n\t}\n}\n\nmodel ${2:Observer} {\n\tupdate(data) {\n\t\t${3:// Handle update}\n\t}\n}",
      },
      {
        label: "api-handler",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "API Request Handler",
        documentation:
          "Creates a complete API request handler with error handling",
        insertText:
          "run ${1:handleRequest}(request, response) {\n\ttest {\n\t\tfixed data = await ${2:processRequest}(request);\n\t\tresponse.status(200).json({ success: true, data });\n\t} grab (error) {\n\t\tspeak.scream('API Error:', error);\n\t\tresponse.status(500).json({ success: false, message: error.message });\n\t}\n}",
      },
      {
        label: "event-handler",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "Event Handler Class",
        documentation:
          "Creates a complete event handler with on/off/emit methods",
        insertText:
          "model ${1:EventHandler} {\n\t__init__() {\n\t\tthis.listeners = {};\n\t}\n\n\ton(event, callback) {\n\t\twhen (!this.listeners[event]) {\n\t\t\tthis.listeners[event] = [];\n\t\t}\n\t\tthis.listeners[event].push(callback);\n\t}\n\n\temit(event, data) {\n\t\twhen (this.listeners[event]) {\n\t\t\tthis.listeners[event].forEach(callback => callback(data));\n\t\t}\n\t}\n}",
      },
    ];

    return patterns.map((pattern) => {
      const completion = new vscode.CompletionItem(pattern.label, pattern.kind);
      completion.detail = pattern.detail;
      completion.documentation = new vscode.MarkdownString(
        pattern.documentation,
      );
      completion.insertText = new vscode.SnippetString(pattern.insertText);
      completion.sortText = `z-${pattern.label}`;
      return completion;
    });
  }

  private getSpeakMethodCompletions(): vscode.CompletionItem[] {
    const methods = [
      {
        label: "say",
        kind: vscode.CompletionItemKind.Method,
        detail: "Console log",
        documentation:
          "Equivalent to console.log() in JavaScript. Outputs messages to the console.",
        insertText: "say(${1:message})",
      },
      {
        label: "scream",
        kind: vscode.CompletionItemKind.Method,
        detail: "Console error",
        documentation:
          "Equivalent to console.error() in JavaScript. Outputs error messages to the console.",
        insertText: "scream(${1:error})",
      },
      {
        label: "yell",
        kind: vscode.CompletionItemKind.Method,
        detail: "Console warn",
        documentation:
          "Equivalent to console.warn() in JavaScript. Outputs warning messages to the console.",
        insertText: "yell(${1:warning})",
      },
    ];

    return methods.map((method) => {
      const completion = new vscode.CompletionItem(method.label, method.kind);
      completion.detail = method.detail;
      completion.documentation = new vscode.MarkdownString(
        method.documentation,
      );
      completion.insertText = new vscode.SnippetString(method.insertText);
      return completion;
    });
  }

  private getClockMethodCompletions(): vscode.CompletionItem[] {
    const methods = [
      {
        label: "now",
        kind: vscode.CompletionItemKind.Method,
        detail: "Get current timestamp",
        documentation:
          "Returns the current timestamp in milliseconds, equivalent to Date.now() in JavaScript.",
        insertText: "now()",
      },
      {
        label: "parse",
        kind: vscode.CompletionItemKind.Method,
        detail: "Parse date string",
        documentation:
          "Parses a date string and returns a timestamp, equivalent to Date.parse() in JavaScript.",
        insertText: "parse(${1:dateString})",
      },
    ];

    return methods.map((method) => {
      const completion = new vscode.CompletionItem(method.label, method.kind);
      completion.detail = method.detail;
      completion.documentation = new vscode.MarkdownString(
        method.documentation,
      );
      completion.insertText = new vscode.SnippetString(method.insertText);
      return completion;
    });
  }

  private getImportCompletions(
    document: vscode.TextDocument,
    _position: vscode.Position,
    beforeCursor: string,
  ): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = [];

    if (beforeCursor.includes("use {") && !beforeCursor.includes("} from")) {
      completions.push(...this.getNamedImportCompletions());
    } else if (
      beforeCursor.endsWith("from ") ||
      beforeCursor.includes("from '") ||
      beforeCursor.includes('from "')
    ) {
      completions.push(...this.getModuleCompletions(document));
    } else if (beforeCursor.includes("use ") && !beforeCursor.includes("{")) {
      completions.push(...this.getDefaultImportCompletions());
    }

    return completions;
  }

  private getNamedImportCompletions(): vscode.CompletionItem[] {
    const commonExports = [
      { name: "fs", description: "File system operations", module: "fs" },
      { name: "path", description: "Path utilities", module: "path" },
      { name: "http", description: "HTTP server", module: "http" },
      { name: "express", description: "Express framework", module: "express" },
      {
        name: "crypto",
        description: "Cryptographic functionality",
        module: "crypto",
      },
    ];

    return commonExports.map((exp) => {
      const completion = new vscode.CompletionItem(
        exp.name,
        vscode.CompletionItemKind.Function,
      );
      completion.detail = `Import ${exp.name} from ${exp.module}`;
      completion.documentation = new vscode.MarkdownString(
        `**${exp.name}** - ${exp.description}\n\n**Module:** \`${exp.module}\``,
      );
      completion.insertText = exp.name;
      return completion;
    });
  }

  private getModuleCompletions(
    _document: vscode.TextDocument,
  ): vscode.CompletionItem[] {
    const modules = [
      { name: "fs", description: "File system operations", type: "built-in" },
      {
        name: "path",
        description: "Path manipulation utilities",
        type: "built-in",
      },
      { name: "http", description: "HTTP server and client", type: "built-in" },
      { name: "express", description: "Fast web framework", type: "npm" },
      { name: "lodash", description: "Utility library", type: "npm" },
    ];

    return modules.map((mod) => {
      const completion = new vscode.CompletionItem(
        mod.name,
        vscode.CompletionItemKind.Module,
      );
      completion.detail = `${mod.type} module - ${mod.description}`;
      completion.documentation = new vscode.MarkdownString(
        `**${mod.name}** (${mod.type} module)\n\n${mod.description}`,
      );
      completion.insertText = `'${mod.name}'`;
      completion.sortText =
        mod.type === "local" ? `a-${mod.name}` : `b-${mod.name}`;
      return completion;
    });
  }

  private getDefaultImportCompletions(): vscode.CompletionItem[] {
    const suggestions = [
      {
        label: "use { }",
        detail: "Named imports",
        insertText: "{ ${1:exports} } from '${2:module}'",
        documentation: "Import specific exports from a module",
      },
      {
        label: "use default",
        detail: "Default import",
        insertText: "${1:name} from '${2:module}'",
        documentation: "Import the default export",
      },
    ];

    return suggestions.map((suggestion) => {
      const completion = new vscode.CompletionItem(
        suggestion.label,
        vscode.CompletionItemKind.Snippet,
      );
      completion.detail = suggestion.detail;
      completion.documentation = new vscode.MarkdownString(
        suggestion.documentation,
      );
      completion.insertText = new vscode.SnippetString(suggestion.insertText);
      return completion;
    });
  }
}

class NullScriptHoverProvider implements vscode.HoverProvider {
  private keywordCache = new Map<string, string>();
  private keywordSet = new Set(
    KEYWORDS.map((kw: KeywordMapping) => kw.nullscript),
  );

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    if (!document.fileName.endsWith(".ns")) {
      return undefined;
    }

    const config = vscode.workspace.getConfiguration("nullscript");
    const hoverEnabled = config.get<boolean>("hover.enabled", true);

    if (!hoverEnabled) {
      return undefined;
    }

    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      return undefined;
    }

    const word = document.getText(wordRange);
    if (!word || word.trim() === "") {
      return undefined;
    }

    if (word.length < 2 || /^\d+$/.test(word)) {
      return undefined;
    }

    const lineText = document.lineAt(position).text;

    if (this.isInCommentOrString(lineText, position.character)) {
      return undefined;
    }

    if (this.isNullScriptOperator(word)) {
      const hoverInfo = this.getHoverInfoFromKeywords(word);
      if (hoverInfo) {
        const enhancedContent =
          hoverInfo +
          "\n\n" +
          "📝 **Note**: This is a valid NullScript operator. If your spell checker flags it as misspelled, " +
          "you can add NullScript keywords to your dictionary or disable spell checking for .ns files.";

        const hover = new vscode.Hover(
          new vscode.MarkdownString(enhancedContent),
          wordRange,
        );
        return hover;
      }
    }

    if (this.keywordSet.has(word)) {
      const hoverInfo = this.getEnhancedHoverInfo(word, document, position);
      if (hoverInfo) {
        return new vscode.Hover(
          new vscode.MarkdownString(hoverInfo),
          wordRange,
        );
      }
    }

    const methodHover = this.getMethodHover(word, lineText, wordRange);
    if (methodHover) {
      return methodHover;
    }

    return undefined;
  }

  private isNullScriptOperator(word: string): boolean {
    const operators = new Set([
      "isnot",
      "moreeq",
      "lesseq",
      "more",
      "less",
      "is",
      "keepgoing",
      "atLast",
    ]);

    return operators.has(word);
  }

  private isInCommentOrString(lineText: string, charIndex: number): boolean {
    const commentIndex = lineText.indexOf("//");
    if (commentIndex !== -1 && commentIndex < charIndex) {
      return true;
    }

    let quoteCount = 0;
    let doubleQuoteCount = 0;
    let backtickCount = 0;

    for (let i = 0; i < charIndex; i++) {
      const char = lineText[i];
      if (char === '"') doubleQuoteCount++;
      else if (char === "'") quoteCount++;
      else if (char === "`") backtickCount++;
    }

    return (
      quoteCount % 2 === 1 ||
      doubleQuoteCount % 2 === 1 ||
      backtickCount % 2 === 1
    );
  }

  private getEnhancedHoverInfo(
    word: string,
    document: vscode.TextDocument,
    position: vscode.Position,
  ): string | undefined {
    if (!word || word.trim() === "") {
      return undefined;
    }

    const cacheKey = `${word}-enhanced`;
    if (this.keywordCache.has(cacheKey)) {
      return this.keywordCache.get(cacheKey);
    }

    const keyword = KEYWORDS.find(
      (kw: KeywordMapping) => kw && kw.nullscript === word,
    );

    if (!keyword) {
      return undefined;
    }

    let hoverContent = `**\`${keyword.nullscript}\`** - ${keyword.description}\n\n`;

    const contextInfo = this.getContextualInfo(word, document, position);
    if (contextInfo) {
      hoverContent += `${contextInfo}\n\n`;
    }

    hoverContent += `🎯 **Category:** ${keyword.category}\n`;
    hoverContent += `📝 **JavaScript Equivalent:** \`${keyword.javascript}\`\n`;
    hoverContent += `⚡ **Performance:** ${this.getPerformanceHint(
      keyword.category,
    )}\n\n`;

    if (keyword.syntax) {
      hoverContent += `**Syntax:**\n\`\`\`nullscript\n${keyword.syntax}\n\`\`\`\n\n`;
    }

    if (keyword.example) {
      hoverContent += `**Example:**\n\`\`\`nullscript\n${keyword.example}\n\`\`\`\n\n`;
    }

    const relatedKeywords = this.getRelatedKeywords(keyword.category, word);
    if (relatedKeywords.length > 0) {
      hoverContent += `**Related Keywords:** ${relatedKeywords.join(", ")}\n\n`;
    }

    const bestPractice = this.getBestPractice(word);
    if (bestPractice) {
      hoverContent += `💡 **Best Practice:** ${bestPractice}\n\n`;
    }

    hoverContent += this.getCategoryTip(keyword.category);

    const usageStats = this.getUsageStatistics(word, document);
    if (usageStats) {
      hoverContent += `\n\n📊 **Usage in File:** ${usageStats}`;
    }

    this.keywordCache.set(cacheKey, hoverContent);
    return hoverContent;
  }

  private getContextualInfo(
    word: string,
    document: vscode.TextDocument,
    position: vscode.Position,
  ): string | undefined {
    const lineText = document.lineAt(position).text;

    if (word === "test" || word === "grab") {
      return "⚠️ **Context:** Consider adding matching `grab` block for error handling";
    }

    if (word === "run" && lineText.includes("later")) {
      return "🚀 **Context:** Async function detected - remember to use `await` when calling";
    }

    if (word === "model") {
      return "🏗️ **Context:** Class definition - consider inheritance and encapsulation";
    }

    if (word === "use" || word === "share") {
      return "📦 **Context:** Module import/export statement";
    }

    return undefined;
  }

  private getPerformanceHint(category: string): string {
    const hints: { [key: string]: string } = {
      "Control Flow": "Minimal overhead",
      "Variables & Declarations": "Fast variable access",
      "Functions & Methods": "Function call overhead",
      Operators: "Optimized operations",
      "Types & Classes": "Object creation cost",
      "Console Methods": "I/O operation cost",
      "Global Objects": "Built-in optimizations",
      "Global Functions": "Native performance",
      "Timing Functions": "Async overhead",
      "Boolean Values": "Primitive value",
      "Modules & Imports": "One-time load cost",
      "Error Handling": "Exception handling cost",
      "Object-Oriented": "Method lookup cost",
      "Async/Await": "Promise overhead",
      Utility: "Varies by operation",
    };

    return hints[category] || "Standard performance";
  }

  private getRelatedKeywords(category: string, currentWord: string): string[] {
    const categoryKeywords = KEYWORDS.filter(
      (kw: KeywordMapping) =>
        kw.category === category && kw.nullscript !== currentWord,
    )
      .slice(0, 4)
      .map((kw: KeywordMapping) => `\`${kw.nullscript}\``);

    return categoryKeywords;
  }

  private getBestPractice(word: string): string | undefined {
    const practices: { [key: string]: string } = {
      test: "Always pair with `grab` for comprehensive error handling",
      run: "Use descriptive function names and consider async patterns",
      model: "Follow single responsibility principle and encapsulation",
      let: "Prefer `fixed` for constants to prevent accidental mutations",
      fixed: "Use for immutable values and configuration",
      when: "Consider using `whatever` for complex branching logic",
      since: "Prefer `for...of` loops when working with arrays",
      use: "Group related imports and organize by source (built-in, npm, local)",
      share: "Export only what's necessary to maintain clean APIs",
    };

    return practices[word];
  }

  private getUsageStatistics(
    word: string,
    document: vscode.TextDocument,
  ): string | undefined {
    const text = document.getText();
    const regex = new RegExp(`\\b${word}\\b`, "g");
    const matches = text.match(regex);
    const count = matches ? matches.length : 0;

    if (count > 1) {
      return `Used ${count} times in this file`;
    }

    return undefined;
  }

  private getMethodHover(
    word: string,
    lineText: string,
    wordRange: vscode.Range,
  ): vscode.Hover | undefined {
    const beforeWord = lineText.substring(0, wordRange.start.character);

    const lastChar = beforeWord[beforeWord.length - 1];
    if (lastChar !== ".") {
      return undefined;
    }

    if (beforeWord.endsWith("speak.")) {
      switch (word) {
        case "say":
        case "scream":
        case "yell":
          return new vscode.Hover(
            new vscode.MarkdownString(this.getSpeakMethodHover(word)),
            wordRange,
          );
        default:
          return undefined;
      }
    }

    if (beforeWord.endsWith("clock.")) {
      switch (word) {
        case "now":
        case "parse":
          return new vscode.Hover(
            new vscode.MarkdownString(this.getClockMethodHover(word)),
            wordRange,
          );
        default:
          return undefined;
      }
    }

    return undefined;
  }

  private getHoverInfoFromKeywords(word: string): string | undefined {
    if (!word || word.trim() === "") {
      return undefined;
    }

    if (this.keywordCache.has(word)) {
      return this.keywordCache.get(word);
    }

    const keyword = KEYWORDS.find(
      (kw: KeywordMapping) => kw && kw.nullscript === word,
    );

    if (!keyword) {
      return undefined;
    }

    let hoverContent = `**\`${keyword.nullscript}\`** - ${keyword.description}\n\n`;
    hoverContent += `🎯 **Category:** ${keyword.category}\n`;
    hoverContent += `📝 **JavaScript Equivalent:** \`${keyword.javascript}\`\n\n`;

    if (keyword.syntax) {
      hoverContent += `**Syntax:**\n\`\`\`nullscript\n${keyword.syntax}\n\`\`\`\n\n`;
    }

    if (keyword.example) {
      hoverContent += `**Example:**\n\`\`\`nullscript\n${keyword.example}\n\`\`\`\n\n`;
    }

    hoverContent += this.getCategoryTip(keyword.category);

    this.keywordCache.set(word, hoverContent);

    return hoverContent;
  }

  private getCategoryTip(category: string): string {
    const tips = new Map<string, string>([
      [
        "Control Flow",
        "💡 **Tip:** Use for program flow control and decision making",
      ],
      [
        "Variables & Declarations",
        "💡 **Tip:** Choose the right declaration based on mutability needs",
      ],
      [
        "Functions & Methods",
        "💡 **Tip:** Functions are the building blocks of reusable code",
      ],
      [
        "Operators",
        "💡 **Tip:** Operators help you compare and manipulate values",
      ],
      [
        "Types & Classes",
        "💡 **Tip:** Classes help organize related data and behavior",
      ],
      ["Console Methods", "💡 **Tip:** Use for debugging and output display"],
      [
        "Global Objects",
        "💡 **Tip:** Built-in objects available throughout your code",
      ],
      ["Global Functions", "💡 **Tip:** Utility functions available globally"],
      [
        "Timing Functions",
        "💡 **Tip:** Use for time-based operations and delays",
      ],
      ["Boolean Values", "💡 **Tip:** Represent true/false conditions"],
      ["Modules & Imports", "💡 **Tip:** Organize code into reusable modules"],
      [
        "Error Handling",
        "💡 **Tip:** Make your code robust with proper error handling",
      ],
      [
        "Object-Oriented",
        "💡 **Tip:** Use classes to model real-world objects",
      ],
      ["Async/Await", "💡 **Tip:** Handle asynchronous operations elegantly"],
      ["Utility", "💡 **Tip:** Helper functions for common tasks"],
    ]);

    return tips.get(category) || "";
  }

  private getSpeakMethodHover(method: string): string {
    const methodInfo: { [key: string]: string } = {
      say: '**`speak.say()`** - Console Log Method\n\n🎯 **Purpose:** Outputs informational messages\n📝 **JavaScript Equivalent:** `console.log()`\n\n**Example:**\n```nullscript\nspeak.say("Hello World!");\n```',
      scream:
        '**`speak.scream()`** - Console Error Method\n\n🎯 **Purpose:** Outputs error messages\n📝 **JavaScript Equivalent:** `console.error()`\n\n**Example:**\n```nullscript\nspeak.scream("Something went wrong!");\n```',
      yell: '**`speak.yell()`** - Console Warning Method\n\n🎯 **Purpose:** Outputs warning messages\n📝 **JavaScript Equivalent:** `console.warn()`\n\n**Example:**\n```nullscript\nspeak.yell("Deprecated function used");\n```',
    };

    return methodInfo[method] || "";
  }

  private getClockMethodHover(method: string): string {
    const methodInfo: { [key: string]: string } = {
      now: "**`clock.now()`** - Current Timestamp\n\n🎯 **Purpose:** Returns current time in milliseconds\n📝 **JavaScript Equivalent:** `Date.now()`\n\n**Example:**\n```nullscript\nfixed timestamp = clock.now();\n```",
      parse:
        '**`clock.parse()`** - Parse Date String\n\n🎯 **Purpose:** Parses a date string and returns timestamp\n📝 **JavaScript Equivalent:** `Date.parse()`\n\n**Example:**\n```nullscript\nfixed parsed = clock.parse("2024-01-01");\n```',
    };

    return methodInfo[method] || "";
  }
}

export function deactivate() {}
