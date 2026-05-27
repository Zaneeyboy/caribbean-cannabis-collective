import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudflare, CF_FOLDERS, type CfFolder } from '@/lib/cloudflare-images';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

// Only admins can upload images — validate the Firebase ID token
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Verify admin auth via bearer token (Firebase ID token)
  const authHeader = req.headers.get('authorization');
  const idToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!idToken) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const { auth, db } = await getFirebaseAdmin();
    const decoded = await auth.verifyIdToken(idToken);

    // Verify admin role — check Firestore user record
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: admins only' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // Parse the multipart form data
  const formData = await req.formData();
  const file = formData.get('file');
  const folderRaw = formData.get('folder');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate and resolve folder — default to products
  const validFolders = Object.values(CF_FOLDERS) as string[];
  const folder: CfFolder = typeof folderRaw === 'string' && validFolders.includes(folderRaw) ? (folderRaw as CfFolder) : CF_FOLDERS.products;

  // Validate file type
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }

  // Validate file size — max 10 MB
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 });
  }

  try {
    const result = await uploadImageToCloudflare(file, folder, {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({ imageId: result.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    console.error('Cloudflare Images upload error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
