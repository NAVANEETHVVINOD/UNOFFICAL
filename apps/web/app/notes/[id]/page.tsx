import { redirect } from 'next/navigation';
import { getServerProfile } from '../../../lib/server-utils';
import NoteDetailsClient from './NoteDetailsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Note Details | LINKER',
    description: 'Study note details.',
};

export default async function NoteDetailsPage() {
    const user = await getServerProfile();

    if (!user?.profile?.isOnboarded) {
        redirect('/onboarding');
    }

    return <NoteDetailsClient />;
}
