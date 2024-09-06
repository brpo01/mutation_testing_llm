import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_SECRET_KEY,
});

const createProjectAssistant = async () => {
  const assistant = await openai.beta.assistants.create({
    name: "Project Comparison",
    description: "An assistant to compare program & corresponding test case based on specific criteria such as program and testcase.",
    instructions: "You are an AI mutation testing agent, you will be provided with a program under test and a corresponding test case containing the fields: program and testcase. Your task: mutate the program under test to test for effectiveness and robustness based on the language. Apply mutations strategically. Focus on subtle changes that test code resilience without breaking core functionality. Aim for realistic scenarios that could occur due to programming errors or edge cases.",
    model: "gpt-4-turbo",
    tools: [{ type: "code_interpreter" }],
  });
return assistant.id
}

const createChatAssistant = async () => {
  const assistant = await openai.beta.assistants.create({
    name: "program Chat assistant",
    description: "An assistant that answers question based on a program under test and a corresponding test case",
    instructions: " You are an AI mutation testing agent, you will be provided with a program under test and a corresponding test case containing the fields: program and testcase. Your task: mutate the program under test to test for effectiveness and robustness based on the language. Apply mutations strategically. Focus on subtle changes that test code resilience without breaking core functionality. Aim for realistic scenarios that could occur due to programming errors or edge cases. You will be required to answer questions based on the provided program under test and the corresponding test case. Strictly answer the question based on the parameters provided",
    model: "gpt-4-turbo",
  })
  return assistant.id
}

const processProgram = async (assistantId, program, testcase) => {
  const thread = await openai.beta.threads.create();
  try {
    const message = await openai.beta.threads.messages.create(
      thread.id,
        {
          role: "user",
          content: `Evaluate this program under test based on the following criteria: Program Under Test: ${program}, Test Case: ${testcase} `
        }
    );

    let run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      { 
        assistant_id: assistantId,
        instructions: "Review the program under test and the corresponding test case and return 'Yes' if the paper meets all criteria and 'No' if it does not. Ensure no additional explanation is given"
      }
    );
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      for (const message of messages.data.reverse()) {
        if(message.role === 'assistant') {
          if (message.content && message.content.length > 0 && message.content[0].type === 'text') {
            const result = message.content[0].text.value;
            console.log(result)
            return result;
          }
        }
      }
    } else {
      console.log("Run status:", run.status);
      return run.status;
    }
  } catch (error) {
    console.error("Failed to process program and test case with assistant:", error.message);
    return null;
  }
}
const assistantChat = async (assistantId, program, testcase, mutationResult, threadId) => {
  try {
    const Program = JSON.stringify({ program });
    const testCase = JSON.stringify({ testcase });
    const userMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `Here is a program under test: ${Program} and ${testCase}. Based on these, can you provide a mutation result: ${mutationResult}?`,
    });

    const questionTimestamp = new Date(userMessage.created_at);

    let run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
      instructions: "Please answer the question strictly using the information from the program under test and a corresponding test case provided."
    });

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      const relevantMessages = messages.data.filter(m => 
        m.role === 'assistant' && new Date(m.created_at) > questionTimestamp
      ).reverse();
      for (const message of relevantMessages) {
        if (message.content && message.content.length > 0 && message.content[0].type === 'text') {
          const result = message.content[0].text.value;    
          return result;
        }
      }
    }
  } catch (error) {
    console.error("Error in assistant chat:", error);
    return "An error occurred while processing your request.";
  }
};
export {processProgram, createProjectAssistant, createChatAssistant, assistantChat}
