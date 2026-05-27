import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

/**
 * POST /api/user/setup
 *
 * Creates a user profile document and links any orphaned guest orders.
 * Uses Firebase Admin SDK so it bypasses Firestore security rules and
 * cannot be spoofed by the client.
 *
 * The caller must supply a valid Firebase ID token in the Authorization header.
 * Body (all optional): { displayName?, newsletterOptIn? }
 * Returns: { isNewUser: boolean }
 */
export async function POST(req: NextRequest) {
  // Verify the caller is authenticated
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const { auth, db } = await getFirebaseAdmin();

  // Verify the ID token and extract claims
  let uid: string;
  let email: string;
  let tokenDisplayName: string;
  let photoURL: string | null;

  try {
    const decoded = await auth.verifyIdToken(token);
    uid = decoded.uid;
    email = decoded.email ?? '';
    tokenDisplayName = decoded.name ?? '';
    photoURL = decoded.picture ?? null;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const newsletterOptIn: boolean = body.newsletterOptIn === true;
  // Caller may override displayName (e.g. from the signup form before updateProfile propagates)
  const displayName: string = (body.displayName as string | undefined) || tokenDisplayName;

  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();
  const isNewUser = !snap.exists;

  if (isNewUser) {
    await userRef.set({
      uid,
      email,
      displayName,
      role: 'customer',
      photoURL,
      newsletterOptIn,
      createdAt: new Date().toISOString(),
    });

    // Link any orders placed as a guest with this email address
    if (email) {
      const orphans = await db.collection('orders').where('customerEmail', '==', email).where('uid', '==', null).get();

      if (!orphans.empty) {
        const batch = db.batch();
        orphans.docs.forEach((d) => batch.update(d.ref, { uid }));
        await batch.commit();
      }
    }
  }

  return NextResponse.json({ isNewUser });
}
