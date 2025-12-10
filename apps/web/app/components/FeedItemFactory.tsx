"use client";

import { FeedItemData } from "../hooks/useInfiniteFeed";
import PostCard from "./feed/PostCard";
import PollCard from "./feed/PollCard";
import EventTicket from "./feed/EventTicket";
import MarketTinyCard from "./feed/MarketTinyCard";

export default function FeedItemFactory({ item }: { item: FeedItemData }) {
    switch (item.type) {
        case 'post':
            return <PostCard post={item.data} />;
        case 'poll':
            return <PollCard poll={item.data} />;
        case 'event':
            return <EventTicket event={item.data} />;
        case 'market':
            return <MarketTinyCard listing={item.data} />;
        default:
            return null;
    }
}
