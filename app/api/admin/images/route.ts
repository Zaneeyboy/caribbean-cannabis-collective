import { NextRequest, NextResponse } from 'next/server';
import { listCfImages, CF_FOLDERS, type CfFolder } from '@/lib/cloudflare-images';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

/**
 * GET /api/admin/images?folder=ccc/products&page=1
 *
 * Lists images from Cloudflare Images for the given folder.
 * Admin-only — requires Authorization: Bearer <firebase-id-token>.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  // Verify admin auth
  const authHeader = req.headers.get('authorization');
  const idToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!idToken) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const { auth, db } = await getFirebaseAdmin();
    const decoded = await auth.verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: admins only' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const folderParam = searchParams.get('folder');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('per_page') ?? '100', 10)));

  const validFolders = Object.values(CF_FOLDERS) as string[];
  const folder: CfFolder | undefined = folderParam && validFolders.includes(folderParam) ? (folderParam as CfFolder) : undefined;

  try {
    const images = await listCfImages(folder, page, perPage);
    return NextResponse.json({ images, folder: folder ?? 'all', page });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to list images';
    console.error('Cloudflare Images list error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
