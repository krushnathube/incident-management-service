const type = process.env.PGTYPE || 'postgres';
const username = process.env.PGUSER || 'postgres';
const password = process.env.PGPASSWORD || 'password';
const host = process.env.PGHOST || 'host.docker.internal';
const port = process.env.PGPORT || 5432;
const database = process.env.PGDATABASE || 'ims';
console.log(`${type}://${username}:${password}@${host}:${port}/${database}`);
module.exports = {
  type,
  url:
    process.env.DATABASE_URL ||
    `${type}://${username}:${password}@${host}:${port}/${database}?sslmode=disable`,
  entities: [
    process.env.NODE_ENV === 'dev'
      ? 'src/entity/**/*.ts'
      : 'build/entity/**/*.js',
  ],
  migrations: [
    process.env.NODE_ENV === 'dev'
      ? 'src/migration/**/*.ts'
      : 'build/migration/**/*.js',
  ],
  cli: {
    entitiesDir:
      process.env.NODE_ENV === 'dev' ? 'src/entity' : 'build/entity',
    migrationsDir:
      process.env.NODE_ENV === 'dev' ? 'src/migration' : 'build/migration',
  },
  synchronize: true,
  logging: false,
};
