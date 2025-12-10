"use client";

import { Link as LinkIcon, ExternalLink } from "lucide-react";

export default function LinkPreviewCard({ url, title, description, image }: any) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="font-mono text-xs mb-1 flex items-center gap-1 text-blue-600 font-bold">
                <LinkIcon className="w-3 h-3" /> shared resource
            </div>
            <div className="bg-black border-2 border-black rounded-lg overflow-hidden shadow-neo group-hover:shadow-neo-lg transition-all">

                {/* Terminal Header */}
                <div className="bg-gray-800 px-3 py-1 flex items-center gap-2 border-b border-gray-700">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate max-w-[200px] opacity-70">
                        {url}
                    </div>
                </div>

                {/* Content */}
                <div className="p-0 bg-gray-900">
                    {image && (
                        <div className="h-32 w-full overflow-hidden relative opacity-80 group-hover:opacity-100 transition-opacity">
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="p-3">
                        <h4 className="text-green-400 font-mono font-bold text-sm truncate mb-1">
                            {`> ${title}`}
                        </h4>
                        <p className="text-gray-400 text-xs font-mono line-clamp-2 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </a>
    );
}
