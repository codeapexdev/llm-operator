"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import ChatFeed from "./components/ChatFeed";
import AnimatedButton from "./components/AnimatedButton";
import Image from "next/image";
import posthog from "posthog-js";

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  return (
    <div className="relative group">
      {children}
      <span className="absolute hidden group-hover:block w-auto px-3 py-2 min-w-max left-1/2 -translate-x-1/2 translate-y-3 bg-gray-900 text-white text-xs rounded-md font-ppsupply">
        {text}
      </span>
    </div>
  );
};

export default function Home() {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // For submitting the form
      if (!isChatVisible && (e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        const form = document.querySelector("form") as HTMLFormElement;
        if (form) {
          form.requestSubmit();
        }
      }
      
      if (!isChatVisible && (e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.querySelector(
          'input[name="message"]'
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }

      // For handling close chat functionality using escape button
      if (isChatVisible && e.key === "Escape") {
        e.preventDefault();
        setIsChatVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatVisible]);

  const startChat = useCallback(
    (finalMessage: string) => {
      setInitialMessage(finalMessage);
      setIsChatVisible(true);

      try {
        posthog.capture("submit_message", {
          message: finalMessage,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [setInitialMessage, setIsChatVisible]
  );

  return (
    <AnimatePresence mode="wait">
      {!isChatVisible ? (
        <div className="min-h-screen bg-[#f7f5fa] flex flex-col">
          {/* Top Navigation */}
          <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-2">              
              <span className="font-ppsupply text-[#864AF9]">LLM</span>
              <span className="font-ppsupply text-gray-900">Operator</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/codeapexdev/llm-operator"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button className="h-fit flex items-center justify-center px-4 py-2 rounded-md bg-[#1b2128] hover:bg-[#1d232b] gap-1 text-sm font-medium text-white border border-pillSecondary transition-colors duration-200">
                  <Image
                    src="/github.svg"
                    alt="GitHub"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  View GitHub
                </button>
              </a>
            </div>
          </nav>
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[640px] bg-white border border-gray-200 shadow-sm">
              <div className="w-full h-12 bg-white border-b border-gray-200 flex items-center px-4">
                <div className="flex items-center gap-2">
                  <Tooltip text="why would you want to close this?">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                  </Tooltip>
                  <Tooltip text="s/o to the 🅱️rowserbase devs">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  </Tooltip>
                  <Tooltip text="@pk_iv was here">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </Tooltip>
                </div>
              </div>
              <div className="p-8 flex flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-3">
                  <h1 className="text-2xl font-ppneue text-gray-900 text-center">
                    LLM Operator
                  </h1>
                  <p className="text-base font-ppsupply text-gray-500 text-center">
                    Your personal Agent who can browse internet like a human.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const input = e.currentTarget.querySelector(
                      'input[name="message"]'
                    ) as HTMLInputElement;
                    const message = (formData.get("message") as string).trim();
                    const finalMessage = message || input.placeholder;
                    startChat(finalMessage);
                  }}
                  className="w-full max-w-[720px] flex flex-col items-center gap-3"
                >
                  <div className="relative w-full">
                    <input
                      name="message"
                      type="text"
                      placeholder="Can Deepseek steal OpenAI's Job?"
                      className="w-full px-4 py-3 pr-[100px] border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#864AF9] focus:border-transparent font-ppsupply"
                    />
                    <AnimatedButton type="submit">Run</AnimatedButton>
                  </div>
                </form>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={() =>
                      startChat(
                        "Name the current best and most cost efficient LLM APIs in the market"
                      )
                    }
                    className="p-3 text-sm text-gray-600 border border-gray-200 hover:border-[#864AF9] hover:text-[#864AF9] transition-colors font-ppsupply text-left"
                  >
                    Name all the cost efficient LLM APIs in the market.
                  </button>
                  <button
                    onClick={() =>
                      startChat("How many wins do the 49ers have?")
                    }
                    className="p-3 text-sm text-gray-600 border border-gray-200 hover:border-[#864AF9] hover:text-[#864AF9] transition-colors font-ppsupply text-left"
                  >
                    Will AI transform QA into magic?
                  </button>
                  <button
                    onClick={() => startChat("What is Stephen Curry's PPG?")}
                    className="p-3 text-sm text-gray-600 border border-gray-200 hover:border-[#864AF9] hover:text-[#864AF9] transition-colors font-ppsupply text-left"
                  >
                    Can Deepseek steal OpenAI's Job?
                  </button>
                  <button
                    onClick={() => startChat("How much is NVIDIA stock?")}
                    className="p-3 text-sm text-gray-600 border border-gray-200 hover:border-[#864AF9] hover:text-[#864AF9] transition-colors font-ppsupply text-left"
                  >
                    What's the role does open source play in shaping today’s technology landscape?
                  </button>
                </div>
              </div>
            </div>
            <p className="text-base font-ppsupply text-center mt-8">
              Powered by{" "}
              <a
                href="https://stagehand.dev"
                className="text-yellow-600 hover:underline"
              >
                🤘 Stagehand
              </a>{" "}
              on{" "}
              <a
                href="https://browserbase.com"
                className="text-[#864AF9] hover:underline"
              >
                🅱️ Browserbase
              </a>
              .
            </p>
          </main>
        </div>
      ) : (
        <ChatFeed
          initialMessage={initialMessage}
          onClose={() => setIsChatVisible(false)}
        />
      )}
    </AnimatePresence>
  );
}


{/* text-[#3B3486] */}