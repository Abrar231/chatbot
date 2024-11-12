import supabase from "@/lib/supabase/client";

interface Params {
    params: { id: string }
}

type MessageObj = {
    id: number;
    type: 'prompt' | 'reply';
    content: string;
    chat_id: number;
    parent: number | null;
    children: number[];
}[]

function restructureMessages(messages: MessageObj) {
    // Create a map to store the parent-child relationships
    const childrenMap = new Map();
    
    // Populate the childrenMap
    messages.forEach(msg => {
      if (msg.children && msg.children.length > 0) {
        msg.children.forEach(childId => {
          childrenMap.set(childId, msg.id);
        });
      }
    });

    // Create a map of id to message object for quick lookup
    const messageMap = new Map(messages.map(msg => [msg.id, msg]));
  
    // Function to recursively build the new structure
    function buildStructure(msgId: number) {
      const msg = messageMap.get(msgId);
      if (!msg) return [];
  
      const result = [msg];
      
      if (msg.children && msg.children.length > 0) {
        msg.children.forEach(childId => {
          result.push(...buildStructure(childId));
        });
      }
      
      return result;
    }
  
    // Find root messages (those without parents)
    const rootMessages = messages.filter(msg => !childrenMap.has(msg.id));
  
    // Build the final structure
    const restructured = rootMessages.flatMap(msg => buildStructure(msg.id));
  
    return restructured;
  }
  
//   const restructuredMessages = restructureMessages(messages);

export async function GET(req: Request, { params }: Params) {
    // const {data, error} = await supabase.
    //     from('Messages')
    //     .select(`id, type, content, chat_id, parent:MessageLinks!MessageLinks_children_id_fkey(parent_id)`)
    //     .eq('chat_id', params.id)
    //     .order('id', {ascending: true});

    const { data, error } = await supabase
        .from('Messages')
        .select(`
          id,
          type,
          content,
          chat_id,
          parent:MessageLinks!children_id(parent_id),
          children:MessageLinks!parent_id(children_id)
        `)
        .eq('chat_id', params.id)
        .order('id');
      
    // if (error) {
    //     console.error('Error fetching messages:', error);
    //     return;
    // }
    if(error){
        return Response.json({error}, {status: 500});
    }

    // const { data } = await supabase
    //     .from('MessageLinks')
    //     .select('*');
      
    const formattedData = data.map(message => ({
        id: message.id,
        type: message.type,
        content: message.content,
        chat_id: message.chat_id,
        parent: message.parent[0]?.parent_id || null,
        children: message.children.map(child => child.children_id)
    }));

    const messages = restructureMessages(formattedData);

    return Response.json({messages}, {status: 200});
}

// { params }: { params: { id: string } }