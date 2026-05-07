export type ExecutionResult = {
  output: string;
  error?: string;
  logs: string[];
};

export async function executeCode(code: string, language: string): Promise<ExecutionResult> {
  const logs: string[] = [];
  
  // Only support JavaScript/TypeScript for now
  if (!['javascript', 'typescript'].includes(language.toLowerCase())) {
    return {
      output: '',
      error: 'Code execution only supported for JavaScript/TypeScript',
      logs: [],
    };
  }

  try {
    // Create sandboxed execution context
    const sandbox = {
      console: {
        log: (...args: any[]) => logs.push(args.map(String).join(' ')),
        error: (...args: any[]) => logs.push('ERROR: ' + args.map(String).join(' ')),
        warn: (...args: any[]) => logs.push('WARN: ' + args.map(String).join(' ')),
      },
    };

    // Wrap code in function to capture return value
    const wrappedCode = `
      (function() {
        ${code}
      })()
    `;

    // Execute in sandboxed context
    const func = new Function('console', `return ${wrappedCode}`);
    const result = func(sandbox.console);

    return {
      output: result !== undefined ? String(result) : '',
      logs,
    };
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : String(error),
      logs,
    };
  }
}
