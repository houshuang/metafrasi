import axios from "axios";
import { cleanJsonString } from "./text";

const prompt = (text) => `Below is a Greek text. First, if the sentences are too
long, split up in proper length sentences, keeping all of the information.  For
each sentence, provide the original, rewrite a version of that sentence in as
simple language as possible such that a small child could understand it, and
provide an English translation.  Finally, provide a comprehensive list of every
single unique words/phrases/expressions including verbs and adjectives/adverbs,
translated to English. Return only valid JSON.

OUTPUT CONTENT: {sentences: [[original, simplified, english]], phrases:[[phrase, explanation]]}
OUTPUT FORMAT: {sentences: [[string, string, string]], phrases: [[string,string]]}

EXAMPLE OUTPUT: {"sentences":[["Οι διωγμένοι αναρχικοί και οι αναρχοσυνδικαλιστές έφυγαν από την Πάτρα τα τελευταία χρόνια του 19ου αιώνα.", "Άνθρωποι που δεν άρεσαν στους άλλους για τις απόψεις τους έφυγαν από την Πάτρα στα τελευταία χρόνια του 19ου αιώνα.", "Anarchists and anarcho-syndicalists left Patras during the last years of the 19th century."],["Η δίωξη ξεκίνησε αμέσως μετά το Διεθνές Συνέδριο της Ρώμης για την Κοινωνική Άμυνα κατά των Αναρχικών, με αποτέλεσμα πολλούς αναρχοσυνδικαλιστές να μετακομίσουν στην Αθήνα για να ιδρύσουν τον «Αναρχικός Εργατικός Σύνδεσμος».", "Ένα πρόβλημα ξεκίνησε αμέσως μετά από μια συνάντηση στη Ρώμη για την υποστήριξη της κοινωνίας ενάντια στους αναρχικούς, με αποτέλεσμα πολλοί αναρχοσυνδικαλιστές να πάνε Αθήνα και να φτιάξουν μια νέα ομάδα που λέγεται «Αναρχικός Εργατικός Σύνδεσμος».", "Persecution began immediately after the International Congress in Rome for Social Defense Against Anarchists, causing many anarcho-syndicalists to move to Athens and establish the Anarchist Labor Union."]],"phrases":[ ["διωγμένοι", "people who were chased away"], ["αναρχικοί", "anarchists"], ["αναρχοσυνδικαλιστές", "anarcho-syndicalists"], ["έφυγαν από την Πάτρα", "left Patras"]]}

TEXT: ${text}

OUTPUT: {`;

const askAI = async (text, apikey) => {
  const url = "https://api.openai.com/v1/chat/completions";
  console.log("Request: " + text);
  const payload = {
    model: "gpt-4",
    messages: [{ role: "user", content: text }],
    max_tokens: 2500,
    n: 1,
    stream: false,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apikey}`,
  };

  try {
    const res = await axios({
      url,
      data: payload,
      method: "post",
      headers,
      stop: ["}"],
      timeout: 100000,
    });
    console.log(res.data.choices[0].message.content);

    const ret = ("{" + res.data.choices[0].message.content.trim()).replaceAll(
      "\n",
      ""
    );
    console.log(ret);
    return ret;
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const processDocument = async (text, documentId) => {
  let apikey = localStorage.getItem("apikey1");
  if (!apikey) {
    apikey = window.prompt("OpenAI key");
    localStorage.setItem("apikey1", apikey);
  }
  const para = text.split("---%---");

  // Initialize array to store JSON responses
  let json = [];

  // Process all paragraphs with rate limiting
  while (para.length > 0) {
    // Get a chunk of max 5 paragraphs
    const chunk = para.splice(0, Math.min(para.length, 5));

    // Send all requests in the chunk
    const promises = chunk.map((n) => askAI(prompt(n), apikey));
    const responses = await Promise.all(promises);

    // Parse responses to JSON and add them to json array
    for (response of responses) {
      try {
        json.push(JSON.parse(response));
      } catch (e) {
        // Handle parsing errors if necessary
      }
    }

    // If there are more paragraphs to process, wait for 1 minute
    if (para.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 90000));
    }
  }

  console.log("All arrived");
  console.log(json);

  // Call some function to handle the responses
  Meteor.call("documents.setGPT", documentId, json);
};
