import { Metadata } from 'next';
import EventsClient from './EventsClient';

export const metadata: Metadata = {
    title: 'Campus Events | LINKER',
    description: 'Discover upcoming events, workshops, and parties at your college.',
};

export default function EventsPage() {
    return <EventsClient />;
}
