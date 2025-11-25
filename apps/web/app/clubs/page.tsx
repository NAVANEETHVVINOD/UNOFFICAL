import { redirect } from 'next/navigation';
import { getServerProfile } from '../../lib/server-utils';
import ClubsClient from './ClubsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Clubs | LINKER',
    description: 'Join the chaos. Find your tribe.',
};

export default async function ClubsPage() {
    const user = await getServerProfile();

    if (!user?.profile?.isOnboarded) {
        redirect('/onboarding');
    }

    return <ClubsClient />;
}
