import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  exportToPDF,
} from '../controllers/document.controller';

const router = Router();

router.post('/', authenticate, createDocument);
router.get('/', authenticate, getDocuments);
router.get('/:id', authenticate, getDocumentById);
router.put('/:id', authenticate, updateDocument);
router.delete('/:id', authenticate, deleteDocument);
router.get('/:id/export', authenticate, exportToPDF);

export default router;
