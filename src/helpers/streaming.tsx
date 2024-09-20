import EventSource from "react-native-sse";

const token = "";

const postDataStream = async (
  url: string,
  model: string,
  max_tokens: number,
  history: Array<{ author: { id: string }; text: string }>,
  message: { text: string },
  temperature: number = 0.7,
  systemPrompt: string = "You are a helpful assistant.",
  callback: (isDone: boolean, text: string | null) => void
) => {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.reverse().map((msg) => ({
      role:
        msg.author.id === "06c33e8b-e835-4736-80f4-63f44b66666c"
          ? "user"
          : "assistant",
      content: msg.text,
    })),
    ...(message.text ? [{ role: "user", content: message.text }] : []),
  ];

  try {
    const es = new EventSource(url + "/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        n: 1,
        temperature,
        stream: true,
      }),
      pollingInterval: 0,
    });

    let text = "";

    es.addEventListener("open", () => console.log("Connection opened"));

    es.addEventListener("message", (event) => {
      if (event.data === "[DONE]") {
        es.close();
        console.log("Connection closing.");
        return;
      }

      const data = JSON.parse(event.data as string);
      console.log("Message received:", data);

      if (data.choices[0].finish_reason === "stop") {
        callback(true, text + "\n");
        es.close();
        console.log("Connection closing. Reason: Empty response.");
      } else if (data.choices[0].delta.content) {
        text += data.choices[0].delta.content;
        callback(false, text);
      }
    });

    es.addEventListener("error", (error) => {
      console.error("EventSource error:", error);
      es.close();
    });

    return text;
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
    throw error;
  }
};

export default postDataStream;
