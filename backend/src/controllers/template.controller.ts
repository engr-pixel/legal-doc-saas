import { Request, Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/auth';

export const getTemplates = async (req: AuthRequest, res: Response) => {
  try {
    const templates = await prisma.template.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTemplateById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, content, category, isPublic } = req.body;

    const template = await prisma.template.create({
      data: {
        name,
        description,
        content,
        category,
        isPublic: isPublic || false,
        createdBy: req.userId!,
      },
    });

    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, content, isPublic } = req.body;

    const template = await prisma.template.updateMany({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(content && { content }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    if (template.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
