'use client'

import type {ChatType} from '@/lib/types'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
interface Props {
    chat: ChatType
}

export default function Chat({chat}: Props) {
    const pathname = usePathname();
    // ${router.pathname === `/chats/${chat.id}` && 'bg-shade'} 

    return (
        <div className="p-px mr-2">
            <Link href={`/chats/${chat.id}`} className={`w-full ${pathname === `/chats/${chat.id}` && 'bg-shade'} h-10 block p-2 rounded-xl`}>
                <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
                    {chat.title}
                </div>
            </Link>
        </div>
    );
}