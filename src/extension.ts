import * as vscode from "vscode";
import { NULLSCRIPT_KEYWORDS } from "./nullscript-keywords";

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

      const builtInCompletions = this.getBuiltInCompletions();

      return builtInCompletions;
    } catch (error) {
      console.error("NullScript completion error:", error);
      return undefined;
    }
  }

  private getBuiltInCompletions(): vscode.CompletionItem[] {
    return NULLSCRIPT_KEYWORDS.filter(
      (keyword) => keyword && keyword.nullscript,
    ).map((keyword) => {
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

  private getSpeakMethodCompletions(): vscode.CompletionItem[] {
    const methods = [
      {
        label: "say",
        kind: vscode.CompletionItemKind.Method,
        detail: "Console log",
        documentation:
          "Equivalent to `console.log()` in JavaScript. Outputs messages to the console.",
        insertText: "say(${1:message})",
      },
      {
        label: "scream",
        kind: vscode.CompletionItemKind.Method,
        detail: "Console error",
        documentation:
          "Equivalent to `console.error()` in JavaScript. Outputs error messages to the console.",
        insertText: "scream(${1:error})",
      },
      {
        label: "yell",
        kind: vscode.CompletionItemKind.Method,
        detail: "Console warn",
        documentation:
          "Equivalent to `console.warn()` in JavaScript. Outputs warning messages to the console.",
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
          "Returns the current timestamp in milliseconds, equivalent to `Date.now()` in JavaScript.",
        insertText: "now()",
      },
      {
        label: "parse",
        kind: vscode.CompletionItemKind.Method,
        detail: "Parse date string",
        documentation:
          "Parses a date string and returns a timestamp, equivalent to `Date.parse()` in JavaScript.",
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
}

class NullScriptHoverProvider implements vscode.HoverProvider {
  private keywordCache = new Map<string, string>();
  private keywordSet = new Set(NULLSCRIPT_KEYWORDS.map((kw) => kw.nullscript));

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
          "you can add NullScript keywords to your dictionary or disable spell checking for `.ns` files.";

        const hover = new vscode.Hover(
          new vscode.MarkdownString(enhancedContent),
          wordRange,
        );
        return hover;
      }
    }

    if (this.keywordSet.has(word)) {
      const hoverInfo = this.getHoverInfoFromKeywords(word);
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

    const dotIndex = beforeWord.lastIndexOf(".");
    if (dotIndex > 0) {
      const lastWordStart = beforeWord.lastIndexOf(" ", dotIndex) + 1;
      const lastWord = beforeWord.substring(lastWordStart);
      const compoundWord = lastWord + word;

      if (this.keywordSet.has(compoundWord)) {
        const compoundHoverInfo = this.getHoverInfoFromKeywords(compoundWord);
        if (compoundHoverInfo) {
          return new vscode.Hover(
            new vscode.MarkdownString(compoundHoverInfo),
            wordRange,
          );
        }
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

    const keyword = NULLSCRIPT_KEYWORDS.find(
      (kw) => kw && kw.nullscript === word,
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
      say: '**`speak.say()`** - Console Log Method\n\n🎯 **Purpose:** Outputs informational messages\n📝 **JavaScript Equivalent:** `console.log()`\n\n**Parameters:**\n- `message` - Any value to display\n- Additional parameters for multiple values\n\n**Examples:**\n```nullscript\nspeak.say("Hello World!");\nspeak.say("User:", userName);\nspeak.say(`Score: ${score}`);\n```',

      scream:
        '**`speak.scream()`** - Console Error Method\n\n🎯 **Purpose:** Outputs error messages\n📝 **JavaScript Equivalent:** `console.error()`\n\n**Parameters:**\n- `error` - Error message or object\n\n**Examples:**\n```nullscript\nspeak.scream("Something went wrong!");\nspeak.scream("Error:", errorObject);\n```\n\n⚠️ **Note:** Typically displayed in red in console',

      yell: '**`speak.yell()`** - Console Warning Method\n\n🎯 **Purpose:** Outputs warning messages\n📝 **JavaScript Equivalent:** `console.warn()`\n\n**Parameters:**\n- `warning` - Warning message\n\n**Examples:**\n```nullscript\nspeak.yell("Deprecated function used");\nspeak.yell("Warning:", warningMessage);\n```\n\n⚠️ **Note:** Typically displayed in yellow in console',
    };

    return methodInfo[method] || "";
  }

  private getClockMethodHover(method: string): string {
    const methodInfo: { [key: string]: string } = {
      now: "**`clock.now()`** - Current Timestamp\n\n🎯 **Purpose:** Returns current time in milliseconds\n📝 **JavaScript Equivalent:** `Date.now()`\n\n**Returns:** Number (milliseconds since Unix epoch)\n\n**Example:**\n```nullscript\nfixed timestamp = clock.now();\nspeak.say(`Current time: ${timestamp}`);\n```",

      parse:
        '**`clock.parse()`** - Parse Date String\n\n🎯 **Purpose:** Parses a date string and returns timestamp\n📝 **JavaScript Equivalent:** `Date.parse()`\n\n**Parameters:**\n- `dateString` - Date string to parse\n\n**Returns:** Number (milliseconds) or NaN if invalid\n\n**Example:**\n```nullscript\nfixed parsed = clock.parse("2024-01-01");\n```',
    };

    return methodInfo[method] || "";
  }
}

export function deactivate() {}
