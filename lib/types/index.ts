export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  syntaxTheme?: string;
  createdAt: string;
  updatedAt: string;
}

export type LanguageOption = {
  value: string;
  label: string;
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'tsx', label: 'TSX' },
  { value: 'jsx', label: 'JSX' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'php', label: 'PHP' },
  { value: 'shell', label: 'Shell' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'text', label: 'Plain Text' },
];

export type SyntaxThemeOption = {
  value: string;
  label: string;
};

export const SYNTAX_THEMES: SyntaxThemeOption[] = [
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'one-light', label: 'One Light' },
  { value: 'nord', label: 'Nord' },
];
