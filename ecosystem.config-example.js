module.exports = {
  apps: [
    {
      name: 'iit-playground',
      script: 'cd /home/xx/xx && npm start',
      cron_restart: '0 0 * * *',
      env: {
        NODE_ENV: "production",
        NEPTUN_CODES: "TEST01,TEST02",
        PORT: 3000
      }
    }
  ]
};
