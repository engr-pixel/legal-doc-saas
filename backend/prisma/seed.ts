import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample templates
  const templates = await Promise.all([
    prisma.template.create({
      data: {
        name: 'Non-Disclosure Agreement',
        description: 'A legal template for NDA agreements',
        content: {
          sections: [
            'Confidential Information Definition',
            'Obligations of Receiving Party',
            'Exceptions',
            'Term',
            'Return of Information',
          ],
        },
        category: 'CONFIDENTIALITY',
        isPublic: true,
        createdBy: 'system',
      },
    }),
    prisma.template.create({
      data: {
        name: 'Service Agreement',
        description: 'A legal template for service agreements',
        content: {
          sections: [
            'Services Provided',
            'Fees and Payment',
            'Term and Termination',
            'Liability',
            'Governing Law',
          ],
        },
        category: 'SERVICE',
        isPublic: true,
        createdBy: 'system',
      },
    }),
    prisma.template.create({
      data: {
        name: 'Employee Agreement',
        description: 'A legal template for employment agreements',
        content: {
          sections: [
            'Employment Terms',
            'Compensation',
            'Benefits',
            'Confidentiality',
            'Termination',
          ],
        },
        category: 'EMPLOYMENT',
        isPublic: true,
        createdBy: 'system',
      },
    }),
  ]);

  console.log('✓ Created sample templates:', templates.map((t) => t.name));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
