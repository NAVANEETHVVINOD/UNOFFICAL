import { redirect } from 'next/navigation';
import { getServerProfile } from '../../lib/server-utils';
import ProfileClient from './ProfileClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Profile | LINKER',
    description: 'Your campus identity.',
};

export default async function ProfilePage() {
    const user = await getServerProfile();

    if (!user?.profile?.isOnboarded) {
        redirect('/onboarding');
    }

    return <ProfileClient />;
}
