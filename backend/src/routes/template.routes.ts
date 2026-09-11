import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
} from '../controllers/template.controller';

const router = Router();

router.get('/', authenticate, getTemplates);
router.get('/:id', authenticate, getTemplateById);
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), createTemplate);
router.put('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), updateTemplate);

export default router;
