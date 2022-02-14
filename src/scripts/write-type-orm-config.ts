import fs = require('fs');
import { getTypeOrmConfig } from './getTypeOrmConfig';

const filename = 'ormconfig.json';

fs.writeFileSync(filename, JSON.stringify(getTypeOrmConfig(), null, 2));
