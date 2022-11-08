import mongoose from 'mongoose';
import { PORT } from './constants';

import * as serverService from './services/server.service';

(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://PMS-2022Q3:eskiIO8rHQanS92N@cluster-project-managem.3dng4tz.mongodb.net/managerApp'
    );
    serverService.server.listen(process.env.PORT || PORT, function () {
      console.log('Сервер ожидает подключения...');
    });
  } catch (error) {
    console.log(error);
  }
})();

process.on('SIGINT', async () => {
  await mongoose.disconnect();
  process.exit();
});
