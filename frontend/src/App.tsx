import "@mantine/core/styles.css";
import {
  ActionIcon,
  Center,
  Container,
  Loader,
  MantineProvider,
  ScrollArea,
  Space,
  Text,
  Textarea,
  ThemeIcon,
  Timeline,
} from "@mantine/core";
import { theme } from "./theme";
import { useEffect, useRef, useState } from "react";
import { IconArrowUp } from "@tabler/icons-react";

const backendUrl = "http://localhost:9000";

type Sentiment = {
  text: string;
  confidence: number;
  sentiment: "Positive" | "Negative" | "Neutral";
  date: Date;
  isPlaceholder: boolean;
};

export default function App() {
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [sentiments, setSentiments] = useState<Sentiment[]>([]);
  const [textareaVal, setTextareaVal] = useState<string>("");
  const [isFetchingSentiment, setIsFetchingSentiment] = useState<boolean>(false);

  useEffect(() => {
    textArea.current?.focus();
  }, []);

  textArea.current?.focus();
  useEffect(() => {
    textArea.current?.focus();
  }, [isFetchingSentiment]);

  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <Center h={"100vh"}>
        <Container style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Text size="xl" ta={"center"}>
            AI Sentiment{" "}
            <Text gradient={{ from: "cyan", to: "red" }} variant="gradient" component="span">
              Analysis
            </Text>
          </Text>
          <Space h="lg" />
          <div style={{ position: "relative", width: "50vw" }}>
            <Textarea
              autosize
              value={textareaVal}
              onChange={(event) => setTextareaVal(event.currentTarget.value)}
              disabled={isFetchingSentiment}
              size={"lg"}
              radius={"md"}
              ref={textArea}
              onKeyDown={handleKeyDown}
              maxLength={500}
              placeholder="Ask anything"
              w={"100%"}
              style={{ paddingBottom: 0 }} // Add space for button
            />
            <ActionIcon
              opacity={isFetchingSentiment || textareaVal.trim() === "" ? 0.3 : 1}
              disabled={isFetchingSentiment || textareaVal.trim() === ""}
              onClick={submitSentiment}
              bg={"white"}
              size={"md"}
              radius="lg"
              style={{
                position: "absolute",
                bottom: 8,
                right: 8,
                zIndex: 2,
              }}
            >
              <IconArrowUp color="black" />
            </ActionIcon>
          </div>
          <Space h="xl" />
          <ScrollArea
            style={{
              alignSelf: "flex-start",
              width: "50vw",
              height: "40vh",
              minHeight: "300px",
              flexGrow: 1,
              overflow: "auto",
            }}
          >
            <Timeline m="sm" color="gray" bulletSize={18}>
              {sentiments.map((sentiment, index) => {
                const bulletSize = 18;
                let bullet;
                if (index === 0 && sentiment.isPlaceholder) {
                  bullet = (
                    <ThemeIcon size={bulletSize} color="gray" radius={"lg"}>
                      <Loader variant="ring" color="cyan" />
                    </ThemeIcon>
                  );
                } else if (sentiment.sentiment === "Positive") {
                  bullet = <ThemeIcon size={bulletSize} radius={"lg"} color="green" />;
                } else if (sentiment.sentiment === "Negative") {
                  bullet = <ThemeIcon size={bulletSize} radius={"lg"} color="red" />;
                } else if (sentiment.sentiment === "Neutral") {
                  bullet = <ThemeIcon size={bulletSize} radius={"lg"} color="gray" />;
                }
                return (
                  <Timeline.Item
                    key={index}
                    bullet={bullet}
                    title={
                      <Text
                        c={index === 0 && sentiment.isPlaceholder ? "dimmed" : "white"}
                        fw={index === 0 && sentiment.isPlaceholder ? "normal" : "bold"}
                      >
                        {sentiment.isPlaceholder ? "Analyzing ..." : sentiment.sentiment}
                        {index === 0 && sentiment.isPlaceholder ? (
                          ""
                        ) : (
                          <Text component="span" c="dimmed">
                            {" "}
                            ({sentiment.confidence})
                          </Text>
                        )}
                      </Text>
                    }
                  >
                    <Text>{sentiment.text}</Text>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </ScrollArea>
        </Container>
      </Center>
    </MantineProvider>
  );

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      submitSentiment();
    }
  }

  async function submitSentiment() {
    if (textareaVal.trim() !== "") {
      const currVal = textareaVal;
      setTextareaVal("");
      setIsFetchingSentiment(true);
      const placeholder: Sentiment = {
        confidence: 0,
        sentiment: "Positive",
        text: "",
        isPlaceholder: true,
        date: new Date(),
      };
      setSentiments((prev) => [placeholder, ...prev]);
      const response = await fetch(`${backendUrl}/sentiment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: currVal }),
      });
      const sentiment = await response.json();
      sentiment.sentiment =
        sentiment.sentiment.charAt(0).toUpperCase() + sentiment.sentiment.slice(1);
      setSentiments((prev) => {
        const updated = [...prev];
        // Replace the last placeholder with the actual sentiment
        updated[0] = { ...sentiment, date: new Date(), isPlaceholder: false };
        return updated;
      });
      setIsFetchingSentiment(false);
    }
  }
}
