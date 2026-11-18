import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
import { can, getSession } from '@/lib/auth';

// يصدر تصريح رفع مؤقت للمدير فقط، والملف يُرفع من المتصفح مباشرة إلى Vercel Blob
export async function POST(request) {
  const body = await request.json();
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!can(await getSession(), 'settings:write')) throw new Error('غير مصرح');
        return {
          allowedContentTypes: ['application/pdf'],
          maximumSizeInBytes: 100 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'فشل الرفع' }, { status: 400 });
  }
}
