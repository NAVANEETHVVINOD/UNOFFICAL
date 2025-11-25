import { Metadata } from 'next';
import EventsClient from './EventsClient';

export const metadata: Metadata = {
    title: 'Campus Events | LINKER',
    description: 'Discover upcoming events, workshops, and parties at your college.',
};

import { redirect } from 'next/navigation';
import { getServerProfile } from '../../lib/server-utils';

export default async function EventsPage() {
    const user = await getServerProfile();
    if (!user?.profile?.isOnboarded) {
        redirect('/onboarding');
    }

    return <EventsClient />;
}
