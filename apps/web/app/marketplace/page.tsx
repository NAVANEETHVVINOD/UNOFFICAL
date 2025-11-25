import { redirect } from 'next/navigation';
import { getServerProfile } from '../../lib/server-utils';
import MarketplaceClient from './MarketplaceClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Marketplace | LINKER',
    description: 'Buy, sell, and trade with your campus community.',
};

export default async function MarketplacePage() {
    const user = await getServerProfile();

    if (!user?.profile?.isOnboarded) {
        redirect('/onboarding');
    }

    return <MarketplaceClient />;
}
