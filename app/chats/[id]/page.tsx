'use client'

import Message from "@/app/components/Message";
// import supabase from "@/lib/supabase/client";
import React, { useEffect, useRef, useState } from "react";
import InputForm from "@/app/components/InputForm";
import { MessageType } from "@/lib/types";

interface Props {
    params: { id: string }
}

export default function ChatPage({ params }: Props) {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const sectionRef = useRef<HTMLDivElement>(null);

    // // const res = await fetch(`/api/chats/${params.id}`);
    // // const messages: MessageType[] = await res.json();
    // const {data, error} = await supabase.
    //     from('Messages')
    //     .select()
    //     .eq('chat_id', params.id);
    // if(error){

    // }
    useEffect(() => {
        const fetchMessages = async () => {
            const res = await fetch(`/api/chats/${params.id}`);
            const data = await res.json();
            setMessages(data.messages);
        }
        fetchMessages();
    }, [params.id]);

    useEffect(() => {
        if (sectionRef.current) {
          // Scroll to the bottom of the section on render
            sectionRef.current.scrollTop = sectionRef.current.scrollHeight;
            // sectionRef.current.lastElementChild?.scrollIntoView()
        }
      }, []);

    console.log(messages)
    // if(!data || data.length === 0){
    //     return (
    //         <section className="w-full h-full">
    //             <div className="text-xl">No messages to display</div>
    //         </section>
    //     )
    // }

    return (
        <>
            <div className="w-full p-5 absolute">ChatGPT</div>
            <div className="w-full h-full pb-28 pt-16 flex flex-col">
                <section 
                    ref={sectionRef} 
                    className="w-full flex-grow md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto overflow-y-auto flex flex-col-reverse"
                >
                    <div>
                        {messages.length > 0 && messages.map(message => <Message key={message.id} message={message} />)}
                    </div>
                </section>
            </div>
            <InputForm setMessages={setMessages} chat_id={params.id} />
            {/* <div className="w-full p-5 absolute">ChatGPT</div>
            <div className="w-full h-full pb-28 pt-16">
                <section ref={sectionRef} className="w-full h-full md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto overflow-y-auto">
                    {messages.length > 0 && messages.map(message => <Message key={message.id} message={message} />)}
                </section>
            </div>
            <InputForm setMessages={setMessages} chat_id={params.id} /> */}
        </>
    );
}