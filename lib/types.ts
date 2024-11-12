export interface ChatType {
    id: number,
    title: string
}

export enum MessageEnum {
    prompt = 'prompt',
    reply = 'reply'
}

export interface MessageType {
    id: number,
    type: MessageEnum,
    content: string,
    chat_id: number,
}