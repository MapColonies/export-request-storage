const config = require('config');
const fs = require('fs');

//config.get returns readonly object
const ormConfig = { ...config.get('typeOrm') };
if (
  ormConfig.ssl &&
  ormConfig.ssl.ca &&
  ormConfig.ssl.cert &&
  ormConfig.ssl.key
) {
  const sslOptions = {
    rejectUnauthorized: ormConfig.ssl.rejectUnauthorized,
    ca: fs.readFileSync(ormConfig.ssl.ca, 'utf-8'),
    cert: fs.readFileSync(ormConfig.ssl.cert, 'utf-8'),
    key: fs.readFileSync(ormConfig.ssl.key, 'utf-8'),
  };
  ormConfig.ssl = sslOptions;
} else {
  ormConfig.ssl = false;
}
ormConfig.migrations = ['src/migration/**/*.ts'];

if (fs.existsSync('./src/migration/ormConfig.json')) {
  fs.unlinkSync('./src/migration/ormConfig.json');
}
fs.writeFileSync('./src/migration/ormConfig.json', JSON.stringify(ormConfig));
