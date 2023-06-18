import axios from "axios";

const prompt = (
  text
) => `Below is a Greek text. In "simplified" want you to rewrite it in Greek so that a child could read it, choosing as simple words as possible, but including the entire contents of the paragraph. The simplified version should be as long as the original, containing all details.  In "english", translate the entire paragraph to English. Finally, provide a list of all the difficult words/phrases, translated to English. Return only JSON.

OUTPUT FORMAT:
{simplified: string, english: string, difficultPhrases: [string, string][]}
TEXT: ${text}

OUTPUT: {`;

const askAI = async (text, apikey) => {
  const url =
    "https://tana-stage.openai.azure.com/openai/deployments/GPT35Turbo/chat/completions?api-version=2023-06-01-preview";

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt(text) }],
    max_tokens: 2000,
    stop: ["}"],
    n: 1,
    stream: false,
  };
  const headers = {
    "Content-Type": "application/json",
    "api-key": apikey,
  };

  try {
    const res = await axios({
      url,
      data: payload,
      method: "post",
      headers,
      timeout: 40000,
    });
    console.log(res.data);

    return JSON.parse("{" + res.data.choices[0].message.content + "}");
  } catch (e) {
    return {};
  }
};

export const processDocument = async (text, documentId) => {
  const apikey = window.prompt("OpenAI key");
  const para = text.split("---%---");
  let promises = para.map((n) => askAI(n, apikey));
  const responses = await Promise.all(promises);
  console.log("All arrived");
  console.log(responses);
  Meteor.call("documents.setGPT", documentId, responses);
};
