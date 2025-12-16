import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { executeCommand } from "../utils/commandParser";
import { getContext, sendChatMessage, askQuestion, submitContact } from "../utils/api";
import type { PortfolioContext } from "@portfolio/shared";
import { TERMINAL_PROMPT } from "@portfolio/shared";

interface TerminalOutputItem {
  id: string;
  type: "command" | "output" | "input";
  command?: string;
  content: string;
  timestamp: number;
  data?: any;
}

interface TerminalProps {
  onRipple?: (x: number, y: number) => void;
}

const WELCOME_MESSAGE: TerminalOutputItem = {
  id: "welcome",
  type: "output",
  content: `Welcome to my AI-powered chat! 🤖\n\nI can help answer questions about me, my work, and more.\nType your message to start chatting, or use commands like "help".\n`,
  timestamp: Date.now()
};

export const Terminal: React.FC<TerminalProps> = ({ onRipple }) => {
  const navigate = useNavigate();
  const [output, setOutput] = useState<TerminalOutputItem[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState<PortfolioContext | null>(null);
  const [isExited, setIsExited] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [inputMode, setInputMode] = useState<null | { field: string; form: Record<string, string> }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load context on mount
  useEffect(() => {
    const loadContext = async () => {
      try {
        const ctx = await getContext();
        setContext(ctx);
      } catch (error) {
        console.error("Failed to load context:", error);
      }
    };
    loadContext();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const addOutput = (content: string, type: "output" = "output", data?: any) => {
    console.log("Adding output:", { content, type, data });
    setOutput((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        type,
        content,
        timestamp: Date.now(),
        data
      }
    ]);
  };

  const addCommand = (cmd: string) => {
    setOutput((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        type: "command",
        command: cmd,
        content: `${TERMINAL_PROMPT}> ${cmd}`,
        timestamp: Date.now()
      }
    ]);
  };

  const runCommand = async (currentInput: string) => {
    if (!currentInput.trim() || isExited || isLoading) return;

    // Handle input mode (contact form)
    if (inputMode) {
      const updatedForm = { ...inputMode.form, [inputMode.field]: currentInput };
      const fields = ["name", "designation", "message", "socialHandle"];
      const nextFieldIndex = fields.indexOf(inputMode.field) + 1;

      if (nextFieldIndex < fields.length) {
        const fieldLabels: Record<string, string> = {
          name: "Enter your name:",
          designation: "Enter your designation:",
          message: "Enter your message:",
          socialHandle: "How should they keep in touch with you? (e.g., Twitter/GitHub/LinkedIn handle):"
        };
        setInputMode({
          field: fields[nextFieldIndex],
          form: updatedForm
        });
        addOutput(fieldLabels[fields[nextFieldIndex]]);
        return;
      }

      // Submit form
      try {
        setIsLoading(true);
        const result = await submitContact({
          name: updatedForm.name,
          designation: updatedForm.designation,
          message: updatedForm.message,
          socialHandle: updatedForm.socialHandle
        });
        addOutput(result.message);
        setInputMode(null);
      } catch (error) {
        addOutput("Error submitting contact form. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Handle chat mode
    if (chatMode) {
      // Exit chat mode if user types 'exit' or a regular command
      const regularCommands = ["help", "about", "projects", "skills", "experience", "education", "contact", "socials", "resume", "clear", "ask"];
      const isRegularCommand = regularCommands.some(cmd => currentInput.toLowerCase().startsWith(cmd));
      
      if (currentInput.toLowerCase() === "exit" || isRegularCommand) {
        setChatMode(false);
        if (currentInput.toLowerCase() === "exit") {
          addOutput("Exiting chat mode...");
          return;
        }
        // Fall through to execute the regular command
      } else {
        // Process as chat message
        try {
          setIsLoading(true);
          const updatedMessages = [...chatMessages, { role: "user" as const, content: currentInput }];
          setChatMessages(updatedMessages);

          const response = await sendChatMessage(updatedMessages);
          addOutput(response);
          setChatMessages([...updatedMessages, { role: "assistant", content: response }]);
        } catch (error) {
          addOutput("Error: Failed to get response from AI");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
        return;
      }
    }

    // Handle regular commands
    try {
      setIsLoading(true);
      console.log("Running command:", currentInput);
      const commandOutputs = await executeCommand(currentInput, context);
      console.log("Command outputs received:", commandOutputs);

      for (const output of commandOutputs) {
        if (output.content === "[CLEAR]") {
          setOutput([{ ...WELCOME_MESSAGE, id: `welcome-${Date.now()}`, timestamp: Date.now() }]);
          continue;
        }
        if (output.type === "text") {
          addOutput(output.content, "output", output.data);
        } else if (output.type === "navigate" && output.data?.path) {
          navigate(output.data.path);
          return;
        } else if (output.type === "input" && output.data?.field === "name") {
          setInputMode({ field: "name", form: {} });
          addOutput("Enter your name:");
        } else if (output.type === "interactive" && output.data?.mode === "chat") {
          setChatMode(true);
          addOutput("Chat mode started. Type your message or 'exit' to quit.");
        } else if (output.type === "interactive" && output.data?.mode === "askFallback") {
          const question = output.data?.question ?? currentInput;
          const response = await askQuestion(question);
          addOutput(response);
        }
      }

      // Handle special commands
      if (currentInput.toLowerCase().startsWith("ask ")) {
        const question = currentInput.slice(4);
        const response = await askQuestion(question);
        addOutput(response);
      }

      if (currentInput.toLowerCase() === "exit") {
        setIsExited(true);
      }
    } catch (error) {
      addOutput("Error executing command");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = input.trim();
    if (!currentInput || isExited || isLoading) return;
    setInput("");
    addCommand(currentInput);
    await runCommand(currentInput);
  };

  const handleClickableCommand = (command: string) => {
    addCommand(command);
    void runCommand(command);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div
      className="terminal-container"
      onClick={(e) => {
        inputRef.current?.focus();
        if (onRipple) {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          onRipple(e.clientX - rect.left, e.clientY - rect.top);
        }
      }}
    >
      <div className="terminal">
        <div className="terminal-output" ref={outputRef}>
          {output.map((item) => {
            const style = (item as any).data?.style;
            const link = (item as any).data?.link;
            const clickCommand = (item as any).data?.clickCommand;
            
            // Determine CSS class based on style
            let className = "";
            if (style === "header") className = "terminal-header";
            else if (style === "title") className = "terminal-title";
            else if (style === "subtitle") className = "terminal-subtitle";
            else if (style === "description") className = "terminal-description";
            else if (style === "tech") className = "terminal-tech";
            else if (style === "date") className = "terminal-date";
            else if (style === "muted") className = "text-muted";
            else if (style === "link") className = "terminal-link";
            
            if (style === "help-row") {
              const cmdName = (item as any).data?.command;
              const cmdDesc = (item as any).data?.description;
              return (
                <div key={item.id} className="terminal-line help-row">
                  <button
                    onClick={() => handleClickableCommand(cmdName)}
                    className="terminal-link-button"
                    style={{ background: "none", border: "none", padding: "2px 4px", cursor: "pointer", marginRight: "12px", minWidth: "100px", textAlign: "left" }}
                  >
                    • {cmdName}
                  </button>
                  <span className="terminal-description">{cmdDesc}</span>
                </div>
              );
            }

            return (
              <div key={item.id} className="terminal-line">
                {item.type === "command" && <span className="text-success">{item.content}</span>}
                {item.type === "output" && (
                  <span className={className}>
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="terminal-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.content}
                      </a>
                    ) : clickCommand ? (
                      <button
                        onClick={() => handleClickableCommand(clickCommand)}
                        className="terminal-link-button"
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      >
                        {item.content}
                      </button>
                    ) : (
                      item.content
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="terminal-input-line">
          <span className="terminal-prompt">{TERMINAL_PROMPT}{`>`}</span>
          <form onSubmit={handleSubmit} className="terminal-form">
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isExited || isLoading}
              placeholder={isExited ? "Session ended" : "Type a command..."}
              autoFocus
            />
          </form>
          {!isExited && <span className="cursor" />}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
