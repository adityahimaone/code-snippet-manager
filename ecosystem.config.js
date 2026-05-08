module.exports = {
  apps: [{
    name: 'code-snippet-manager',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3003',
    cwd: '/home/adityahimaone/apps/code-snippet-manager',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: 'production',
      PORT: 3003,
      NEXT_PUBLIC_BASE_URL: 'https://snippets.adityahimaone.space'
    }
  }]
};