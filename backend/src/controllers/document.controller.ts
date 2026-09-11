import { Request, Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/auth';
import PDFDocument from 'pdfkit';
import { z } from 'zod';

const createDocumentSchema = z.object({
  title: z.string().min(1),
  templateId: z.string(),
  content: z.record(z.any()).optional(),
});

export const createDocument = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createDocumentSchema.parse(req.body);

    const document = await prisma.document.create({
      data: {
        title: validatedData.title,
        content: validatedData.content || {},
        userId: req.userId!,
        templateId: validatedData.templateId,
        status: 'DRAFT',
      },
    });

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.userId },
      include: { template: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: {
        id,
        userId: req.userId,
      },
      include: { template: true },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    const document = await prisma.document.updateMany({
      where: {
        id,
        userId: req.userId,
      },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(status && { status }),
      },
    });

    if (document.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.document.deleteMany({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const exportToPDF = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: {
        id,
        userId: req.userId,
      },
      include: { template: true },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Create PDF
    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${document.title}.pdf"`);

    pdfDoc.pipe(res);

    // Add content to PDF
    pdfDoc.fontSize(20).text(document.title, 100, 100);
    pdfDoc.fontSize(12).text(`Created: ${document.createdAt.toLocaleDateString()}`, 100, 150);
    pdfDoc.moveDown();
    pdfDoc.text(JSON.stringify(document.content, null, 2));

    pdfDoc.end();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
