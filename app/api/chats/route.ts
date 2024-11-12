import openai from '@/lib/openai/index';
import supabase from '@/lib/supabase/client'

// import config from '@/config'

// // Create a single supabase client for interacting with your database
// if (!config.supabaseUrl || !config.supabaseKey) {
//     throw new Error('Supabase URL and Key must be provided in config.js');
// }

type RequestBody = {
    chat_id: number | undefined;
    content: string;
    parent_id: number | undefined
};


// Create a single supabase client for interacting with your database
// const supabase = createClient(config.supabaseUrl, config.supabaseKey);


export async function POST(req: Request) {
    const {chat_id, content, parent_id}: RequestBody = await req.json();
    let chatId: number | undefined = chat_id;
    if(!chatId){
        // using content create chat title and save this instance
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",//"gpt-4o-mini",  gpt-4o,  gpt-4o-mini,  gpt-4,  and gpt-3.5-turbo.
            messages: [
                { role: "system", content: "You are a helpful assistant. Suggest a title for the input given by user in atmost 5 words" },
                {
                    role: "user",
                    content,
                },
            ],
        });
        // console.log(completion.choices[0].message.content);
        const { data, error } = await supabase
            .from('Chats')
            .insert({ title: completion.choices[0].message.content, createdAt: new Date(), updatedAt: new Date() })
            .select();
        if(!data){
            return Response.json({error}, {status: 500});
        }
        chatId = data[0].id;
        // id of new chat created: data[0].id
    }

    // Adding prompt by user
    const { data: dataPrompt, error: errorPrompt } = await supabase
        .from('Messages')
        .insert({ type: 'prompt', content, chat_id: chatId, createdAt: new Date(), updatedAt: new Date() })
        .select();    
    if(!dataPrompt){
        return Response.json({error: errorPrompt}, {status: 500});
    }
    const { error: errorPropmtLinks } = await supabase
        .from('MessageLinks')
        .insert({ parent_id, children_id: dataPrompt[0].id })
        .select(); 
    if(errorPropmtLinks){
        return Response.json({error: errorPropmtLinks}, {status: 500});
    }

    //  call openai API to get response for the prompt
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",//"gpt-4o-mini",  gpt-4o,  gpt-4o-mini,  gpt-4,  and gpt-3.5-turbo.
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "assistant",
                content,
            },
        ],
    });

    // Prompt Reply: completion.choices[0].message.content
    
    //  save response to DB and then return
    const { data: dataReply, error: errorReply } = await supabase
        .from('Messages')
        .insert({ type: 'reply', content: completion.choices[0].message.content, chat_id: chatId, createdAt: new Date(), updatedAt: new Date() })
        .select();
    if(!dataReply){
        return Response.json({error: errorReply}, {status: 500});
    }
    const { error: errorReplyLinks } = await supabase
        .from('MessageLinks')
        .insert({ parent_id: dataPrompt[0].id, children_id: dataReply[0].id })
        .select(); 
    if(errorReplyLinks){
        return Response.json({error: errorReplyLinks}, {status: 500});
    }
    return Response.json({ dataPrompt, dataReply }, { status: 200});
}


export async function GET() {
    const { data, error } = await supabase
        .from('Chats')
        .select()
    return Response.json({data, error}, {status: 200});
}

// export async function POST() {
//     const { data, error } = await supabase
//         .from('Chats')
//         .insert({ title: 'Test 3', createdAt: new Date(), updatedAt: new Date() })
//         .select()
//     return Response.json({data, error}, {status: 200});
// }