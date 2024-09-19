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
    instructions: "You are a Senior Software Engineer, you will be provided with a program under test and a corresponding test case containing the fields: program and testcase. Your task: mutate the program under test to test for effectiveness and robustness based on the language. Apply mutations strategically. Focus on subtle changes that test code resilience without breaking core functionality. Aim for realistic scenarios that could occur due to programming errors or edge cases.",
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

const processProgram = async (assistantId, decodedProgram, decodedTestcase) => {
  const thread = await openai.beta.threads.create();
  try {
    const message = await openai.beta.threads.messages.create(
      thread.id,
        {
          role: "user",
          content: `Evaluate this program under test based on the following criteria: Program Under Test: ${decodedProgram}, Test Case: ${decodedTestcase} `
        }
    );

    let run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      { 
        assistant_id: assistantId,
        instructions: "You are a Senior Software Engineer, you will be provided with a program under test and a corresponding test case containing the fields: program and testcase. Follow each task judiciously. Tasks 1. Analyze the source code line by line. 2. Generate mutations for each covered lines ({{covered_lines}}). 3. Focus on function blocks and critical areas. 4. Ensure mutations provide insights into code quality and test coverage. 5. Organize output by ascending line numbers. 6. Do not include manually added line numbers in your response. 7. Generate single-line mutations only. 8. Based on the test cases, compare the mutated program against the provided test case. 9. Provide the list of testcases by the function name showing which testcase was able to detect mutants and testcases not able to detect the mutants. Say \"Killed Mutant\" for being able to detect mutant and \"Mutant Survived\" for vice versa. 10. Write a full test suite with detailed test cases in code format to validate each function. Make sure these are effective test cases that resolve all the detected bugs. 11. Apply mutations strategically. Focus on subtle changes that test code resilience without breaking core functionality. Aim for realistic scenarios that could occur due to programming errors or edge cases. 12. Please provide a detailed and well-structured response with clear headings and subheadings. Use bullet points, numbered lists, and code blocks where appropriate and remove any # and *. Strictly answer the question based on the parameters provided. Dont provide an opening speech, just go straight to the point with the result. Example Output \`\`\`yaml source_file: {{src_code_file}} mutants: - function_name: <function name> type: <mutation type> description: <brief mutation description> line_number: <line number> original_code: | <original code> mutated_code: | <mutated code and {{language}} comment explaining mutation> \`\`\`"
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
      instructions: "You are an AI mutation testing agent, you will be provided with a program under test and a corresponding test case containing the fields: program and testcase. Your task: mutate the program under test to test for effectiveness and robustness based on the language. Apply mutations strategically. Focus on subtle changes that test code resilience without breaking core functionality. Aim for realistic scenarios that could occur due to programming errors or edge cases. You will be required compare the mutated program with the test case and specify which testcase was able to kill the mutants and which mutants survived. After that generate a new set effective test cases that will address all the issues noticed in the program. Strictly answer the question based on the parameters provided",
    }
  );
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
