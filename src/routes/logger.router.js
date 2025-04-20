import { Router } from 'express';
import { addLogger } from '../utils/logger.js';

const router = Router();

router.get('/testLogs', (req, res) => {
    req.logger.fatal('Este es un mensaje fatal');
    req.logger.error('Este es un mensaje de error');
    req.logger.warning('Este es un mensaje de advertencia');
    req.logger.info('Este es un mensaje informativo');
    req.logger.debug('Este es un mensaje de debug');

    res.send('Logs generados correctamente. Revisa la consola y el archivo errors.log');
});

export default router; 