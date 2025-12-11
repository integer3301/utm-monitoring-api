export const config = {
  telegram: {
    token: process.env.TG_TOKEN || '',
    groupId: process.env.TG_CHAT_ID || '',
  },
  email: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  poller: {
    intervalSeconds: parseInt(process.env.POLLER_INTERVAL || '5'), // интервал опроса
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'utm_monitoring',
  },
};
