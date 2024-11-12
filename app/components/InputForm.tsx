'use client'

import { MessageEnum, MessageType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { revalidateNav } from "../actions";

type Props = {
    setMessages: Dispatch<SetStateAction<MessageType[]>>,
    chat_id: string | undefined
}

export default function InputForm({setMessages, chat_id}: Props) {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Adjust the height of the textarea based on its content
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height to auto
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`; // Max 160px (~5 rows)
        }
    };
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        adjustTextareaHeight();
        setText(e.currentTarget.value);
    }

    const handleSubmit= async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const prompt: MessageType = {
            id: 0,
            type: MessageEnum.prompt,
            content: text,
            chat_id: parseInt(chat_id? chat_id: '0'),
        }
        setMessages(prev => [...prev, prompt]);
        //  API call to send prompt
        //  Code Here...
        const res = await fetch(`/api/chats`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({content: text, chat_id})
        });
        const data = await res.json();
        
        if(chat_id === undefined){
            revalidateNav('/');
            router.push(`/chats/${data.dataPrompt[0].chat_id}`);
        }
        if(data.dataPrompt[0] && chat_id !== undefined){
            setMessages(prev => [...prev.slice(0, prev.length-1), data.dataPrompt[0], data.dataReply[0]]);
            setText('');
            setIsSubmitting(false);
        }
    }

    // Auto-adjust the textarea when the component first renders
    useEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    return (
        <div className="w-full absolute mb-2 bottom-0 flex justify-center">
            <div className="grow md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
                <form onSubmit={handleSubmit}>
                    <div className="flex p-3 rounded-3xl my-5 w-full bg-lightShade max-h-40 gap-3 items-end ">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full text-token-text-primary dark:text-white focus-visible:outline-black dark:focus-visible:outline-white mb-1">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z" fill="currentColor"></path></svg>
                        </div>
                        <div className="grow max-h-32">
                            <textarea ref={textareaRef} className="border-none p-0 m-0 bg-transparent outline-none focus:ring-0 w-full resize-none overflow-y-auto max-h-32" name="" id="" value={text} rows={1} onInput={handleInput} placeholder="Message ChatGPT"></textarea>
                        </div>
                        <div className="">
                            <button type="submit" disabled={!text.length || isSubmitting} className="mb-1 me-1 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:outline-black disabled:text-[#f4f4f4] disabled:hover:opacity-100 dark:bg-white dark:text-black dark:focus-visible:outline-white disabled:dark:bg-token-text-quaternary dark:disabled:text-token-main-surface-secondary disabled:bg-[#D7D7D7]">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-2xl"><path fillRule="evenodd" clipRule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"></path></svg>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}