"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { SupportedLanguage } from "@/lib/compiler";

type IdeMode = "compiler" | "web";

interface ExecutionResult {
  stdout: string;
  stderr: string;
  compilationError?: string;
  executionTimeMs: number;
  status: "success" | "error" | "timeout" | "compilation_error";
}

const STARTER_TEMPLATES: Record<SupportedLanguage, Record<string, string>> = {
  cpp: {
    hello: `#include <iostream>

using namespace std;

int main() {
    cout << "Hello, World from C++17!" << endl;
    return 0;
}
`,
    io: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    // Fast I/O
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (cin >> n) {
        vector<int> arr(n);
        int sum = 0;
        for (int i = 0; i < n; i++) {
            cin >> arr[i];
            sum += arr[i];
        }
        cout << "Read " << n << " elements. Total sum = " << sum << endl;
    } else {
        cout << "Please provide custom input in the STDIN tab!" << endl;
    }
    return 0;
}
`,
    algo: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// Binary Search implementation
int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;
    int idx = binarySearch(arr, target);
    
    if (idx != -1) {
        cout << "Element " << target << " found at index " << idx << endl;
    } else {
        cout << "Element not found" << endl;
    }
    return 0;
}
`,
  },
  c: {
    hello: `#include <stdio.h>

int main() {
    printf("Hello, World from C (Clang)!\n");
    return 0;
}
`,
    io: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        int sum = 0;
        for (int i = 0; i < n; i++) {
            int val;
            scanf("%d", &val);
            sum += val;
        }
        printf("Array count: %d, Sum: %d\n", n, sum);
    } else {
        printf("Provide input in STDIN tab (e.g. 3\\n10 20 30)\n");
    }
    return 0;
}
`,
    algo: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    bubbleSort(arr, n);
    
    printf("Sorted array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    return 0;
}
`,
  },
  java: {
    hello: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World from Java 17!");
    }
}
`,
    io: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int sum = 0;
            for (int i = 0; i < n; i++) {
                sum += sc.nextInt();
            }
            System.out.println("Read " + n + " integers. Sum = " + sum);
        } else {
            System.out.println("Provide custom input in the STDIN tab (e.g. 4\\n1 2 3 4)");
        }
        sc.close();
    }
}
`,
    algo: `import java.util.*;

public class Main {
    // Two-Sum Problem
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("Indices: [" + result[0] + ", " + result[1] + "]");
    }
}
`,
  },
  python: {
    hello: `def main():
    print("Hello, World from Python 3!")

if __name__ == "__main__":
    main()
`,
    io: `import sys

def main():
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        nums = [int(x) for x in input_data[1:n+1]]
        print(f"Read {len(nums)} numbers: {nums}")
        print(f"Sum = {sum(nums)}, Average = {sum(nums)/len(nums):.2f}")
    else:
        print("Provide custom numbers in the STDIN tab!")

if __name__ == "__main__":
    main()
`,
    algo: `def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

def main():
    terms = 10
    fib_series = [fibonacci(i) for i in range(terms)]
    print(f"First {terms} Fibonacci numbers:")
    print(fib_series)

if __name__ == "__main__":
    main()
`,
  },
};

const DEFAULT_WEB_STARTER = {
  html: `<div class="container">
  <h1>Interactive Web Canvas</h1>
  <p>Write modern HTML, CSS, and JavaScript in real-time.</p>
  <button id="action-btn">Click Me 🚀</button>
  <div id="output-box" class="output-box"></div>
</div>`,
  css: `body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  padding: 20px;
}
.container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}
h1 {
  margin-top: 0;
  color: #38bdf8;
  font-size: 24px;
}
p {
  color: #94a3b8;
  font-size: 14px;
}
button {
  background: linear-gradient(135deg, #ff5722 0%, #ff8a00 100%);
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s ease;
}
button:hover {
  transform: translateY(-2px);
}
.output-box {
  margin-top: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #34d399;
}`,
  js: `let clickCount = 0;
const btn = document.getElementById("action-btn");
const output = document.getElementById("output-box");

btn.addEventListener("click", () => {
  clickCount++;
  output.textContent = \`Action triggered \${clickCount} time\${clickCount > 1 ? "s" : ""}!\`;
  console.log("Button clicked. Count:", clickCount);
});`,
};

export function StandaloneIde() {
  const [mode, setMode] = useState<IdeMode>("compiler");
  const [language, setLanguage] = useState<SupportedLanguage>("cpp");
  const [selectedPreset, setSelectedPreset] = useState<string>("hello");
  const [code, setCode] = useState<string>("");
  const [stdin, setStdin] = useState<string>("");
  const [showStdinBox, setShowStdinBox] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"output" | "stdin">("output");

  // Web mode state
  const [webTab, setWebTab] = useState<"html" | "css" | "js">("html");
  const [webHtml, setWebHtml] = useState<string>(DEFAULT_WEB_STARTER.html);
  const [webCss, setWebCss] = useState<string>(DEFAULT_WEB_STARTER.css);
  const [webJs, setWebJs] = useState<string>(DEFAULT_WEB_STARTER.js);
  const [webConsoleLogs, setWebConsoleLogs] = useState<{ id: string; type: string; text: string; time: string }[]>([]);
  const [webRightTab, setWebRightTab] = useState<"preview" | "console">("preview");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize or restore code on language change
  useEffect(() => {
    if (mode === "compiler") {
      try {
        const saved = localStorage.getItem(`nexus_ide_code_${language}`);
        if (saved) {
          setCode(saved);
        } else {
          setCode(STARTER_TEMPLATES[language][selectedPreset] || STARTER_TEMPLATES[language].hello);
        }
      } catch {
        setCode(STARTER_TEMPLATES[language][selectedPreset] || STARTER_TEMPLATES[language].hello);
      }
      setResult(null);
    }
  }, [language, mode]);

  // Persist compiler code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    try {
      localStorage.setItem(`nexus_ide_code_${language}`, newCode);
    } catch {}
  };

  // Change preset boilerplate
  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const template = STARTER_TEMPLATES[language][presetKey] || STARTER_TEMPLATES[language].hello;
    setCode(template);
    try {
      localStorage.setItem(`nexus_ide_code_${language}`, template);
    } catch {}
  };

  // Run backend code (C, C++, Java, Python)
  const handleRunCompiler = async () => {
    setIsRunning(true);
    setActiveConsoleTab("output");
    setResult(null);

    try {
      const res = await fetch("/api/compiler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          stdin,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult({
          stdout: "",
          stderr: data.error || "Execution failed",
          executionTimeMs: 0,
          status: "error",
        });
      } else {
        setResult({
          stdout: data.stdout || "",
          stderr: data.stderr || "",
          compilationError: data.compilationError,
          executionTimeMs: data.executionTimeMs || 0,
          status: data.status || "success",
        });
      }
    } catch (err: any) {
      setResult({
        stdout: "",
        stderr: err?.message || "Network error connecting to execution engine",
        executionTimeMs: 0,
        status: "error",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Compile Web Doc for iframe
  const compileWebDoc = useCallback(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${webCss}
  </style>
  <script>
    (function() {
      function send(type, args) {
        try {
          const text = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          window.parent.postMessage({ type: 'IDE_WEB_CONSOLE', level: type, text, time: new Date().toLocaleTimeString() }, '*');
        } catch(e) {}
      }
      console.log = function(...args) { send('log', args); };
      console.warn = function(...args) { send('warn', args); };
      console.error = function(...args) { send('error', args); };
      window.onerror = function(msg) { send('error', [msg]); };
    })();
  </script>
</head>
<body>
  ${webHtml}
  <script>
    try {
      ${webJs}
    } catch(err) {
      console.error(err.message);
    }
  </script>
</body>
</html>`;
  }, [webHtml, webCss, webJs]);

  // Listen for Web iframe messages
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data && e.data.type === "IDE_WEB_CONSOLE") {
        setWebConsoleLogs((prev) => [
          ...prev.slice(-99),
          { id: Math.random().toString(36), type: e.data.level, text: e.data.text, time: e.data.time },
        ]);
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, []);

  // Update web preview
  useEffect(() => {
    if (mode === "web" && iframeRef.current) {
      iframeRef.current.srcdoc = compileWebDoc();
    }
  }, [mode, compileWebDoc]);

  // Tab key indents by 2 spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const current = ta.value;
      const updated = current.substring(0, start) + "  " + current.substring(end);

      if (mode === "compiler") {
        handleCodeChange(updated);
      } else {
        if (webTab === "html") setWebHtml(updated);
        else if (webTab === "css") setWebCss(updated);
        else setWebJs(updated);
      }

      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (mode === "compiler") handleRunCompiler();
      else if (iframeRef.current) iframeRef.current.srcdoc = compileWebDoc();
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    const text = mode === "compiler" ? code : webTab === "html" ? webHtml : webTab === "css" ? webCss : webJs;
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  // Download code file
  const handleDownloadCode = () => {
    const extMap: Record<SupportedLanguage, string> = {
      cpp: "main.cpp",
      c: "main.c",
      java: "Main.java",
      python: "main.py",
    };
    const filename = mode === "compiler" ? extMap[language] : `${webTab}.txt`;
    const content = mode === "compiler" ? code : webTab === "html" ? webHtml : webTab === "css" ? webCss : webJs;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", background: "#0b0f17", color: "#f8fafc" }}>
      {/* Top IDE Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 18px",
          background: "#0f172a",
          borderBottom: "1px solid #1e293b",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>💻</span>
            <div>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#f8fafc" }}>Online IDE &amp; Execution Sandbox</span>
              <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>
                Zero-setup standalone compiler &amp; web playground
              </span>
            </div>
          </div>

          {/* Engine Mode Toggle */}
          <div style={{ display: "flex", background: "#080c14", borderRadius: "6px", padding: "2px", border: "1px solid #334155" }}>
            <button
              type="button"
              onClick={() => setMode("compiler")}
              style={{
                background: mode === "compiler" ? "#0284c7" : "transparent",
                color: mode === "compiler" ? "#ffffff" : "#94a3b8",
                border: "none",
                borderRadius: "4px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ⚡ C / C++ / Java / Python
            </button>
            <button
              type="button"
              onClick={() => setMode("web")}
              style={{
                background: mode === "web" ? "#0284c7" : "transparent",
                color: mode === "web" ? "#ffffff" : "#94a3b8",
                border: "none",
                borderRadius: "4px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🌐 HTML / CSS / JS Sandbox
            </button>
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {mode === "compiler" ? (
            <>
              {/* Language Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>Language:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  style={{
                    background: "#1e293b",
                    color: "#f8fafc",
                    border: "1px solid #475569",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="cpp">C++17 (Clang++)</option>
                  <option value="c">C (Clang -O2)</option>
                  <option value="java">Java 17 (OpenJDK)</option>
                  <option value="python">Python 3.x</option>
                </select>
              </div>

              {/* Boilerplate Preset */}
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                style={{
                  background: "#1e293b",
                  color: "#cbd5e1",
                  border: "1px solid #334155",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="hello">Template: Hello World</option>
                <option value="io">Template: Fast I/O Reading</option>
                <option value="algo">Template: Standard Algorithm</option>
              </select>

              {/* Run Code Button */}
              <button
                type="button"
                onClick={handleRunCompiler}
                disabled={isRunning}
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "6px 18px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: isRunning ? "wait" : "pointer",
                  boxShadow: "0 2px 10px rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {isRunning ? "Executing..." : "▶ Run (Cmd+Enter)"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  if (iframeRef.current) iframeRef.current.srcdoc = compileWebDoc();
                }}
                style={{
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  padding: "6px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ▶ Refresh Sandbox
              </button>
            </>
          )}

          {/* Quick utility buttons */}
          <button
            type="button"
            onClick={handleCopyCode}
            title="Copy Code"
            style={{
              background: "#1e293b",
              color: "#cbd5e1",
              border: "1px solid #334155",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            📋 Copy
          </button>

          <button
            type="button"
            onClick={handleDownloadCode}
            title="Download source code"
            style={{
              background: "#1e293b",
              color: "#cbd5e1",
              border: "1px solid #334155",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            💾 Download
          </button>
        </div>
      </div>

      {/* Main Split Screen Area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* LEFT / CENTER: CODE EDITOR */}
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column", borderRight: "1px solid #1e293b", background: "#090d16" }}>
          {/* Sub Tab Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#0c121e",
              borderBottom: "1px solid #1e293b",
              padding: "0 12px",
            }}
          >
            {mode === "compiler" ? (
              <div style={{ padding: "8px 4px", fontSize: "12px", fontWeight: 700, color: "#38bdf8" }}>
                Source Editor: {language === "cpp" ? "main.cpp" : language === "c" ? "main.c" : language === "java" ? "Main.java" : "main.py"}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "2px" }}>
                <button
                  type="button"
                  onClick={() => setWebTab("html")}
                  style={{
                    padding: "8px 14px",
                    background: webTab === "html" ? "#090d16" : "transparent",
                    color: webTab === "html" ? "#e34c26" : "#64748b",
                    border: "none",
                    borderBottom: webTab === "html" ? "2px solid #e34c26" : "2px solid transparent",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  index.html
                </button>
                <button
                  type="button"
                  onClick={() => setWebTab("css")}
                  style={{
                    padding: "8px 14px",
                    background: webTab === "css" ? "#090d16" : "transparent",
                    color: webTab === "css" ? "#38bdf8" : "#64748b",
                    border: "none",
                    borderBottom: webTab === "css" ? "2px solid #38bdf8" : "2px solid transparent",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  styles.css
                </button>
                <button
                  type="button"
                  onClick={() => setWebTab("js")}
                  style={{
                    padding: "8px 14px",
                    background: webTab === "js" ? "#090d16" : "transparent",
                    color: webTab === "js" ? "#facc15" : "#64748b",
                    border: "none",
                    borderBottom: webTab === "js" ? "2px solid #facc15" : "2px solid transparent",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  script.js
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (confirm("Reset current editor code to default?")) {
                  if (mode === "compiler") {
                    const template = STARTER_TEMPLATES[language][selectedPreset];
                    setCode(template);
                    localStorage.removeItem(`nexus_ide_code_${language}`);
                  } else {
                    setWebHtml(DEFAULT_WEB_STARTER.html);
                    setWebCss(DEFAULT_WEB_STARTER.css);
                    setWebJs(DEFAULT_WEB_STARTER.js);
                  }
                }
              }}
              style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "11px", cursor: "pointer" }}
            >
              ↺ Reset
            </button>
          </div>

          {/* Textarea Code Body */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <textarea
              ref={textareaRef}
              value={mode === "compiler" ? code : webTab === "html" ? webHtml : webTab === "css" ? webCss : webJs}
              onChange={(e) => {
                if (mode === "compiler") {
                  handleCodeChange(e.target.value);
                } else {
                  if (webTab === "html") setWebHtml(e.target.value);
                  else if (webTab === "css") setWebCss(e.target.value);
                  else setWebJs(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              placeholder="Write your code here..."
              style={{
                width: "100%",
                height: "100%",
                background: "#090d16",
                color: "#e2e8f0",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: "13px",
                lineHeight: "1.6",
                padding: "16px",
                border: "none",
                outline: "none",
                resize: "none",
                whiteSpace: "pre",
                overflowWrap: "normal",
                overflowX: "auto",
                tabSize: 2,
              }}
            />
          </div>

          {/* Bottom Editor Bar */}
          <div
            style={{
              padding: "4px 14px",
              background: "#0c121e",
              borderTop: "1px solid #1e293b",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            <span>
              Lines: {(mode === "compiler" ? code : webTab === "html" ? webHtml : webTab === "css" ? webCss : webJs).split("\n").length}
            </span>
            <span>Shortcut: Press <b>Cmd+Enter</b> to Run</span>
          </div>
        </div>

        {/* RIGHT: OUTPUT TERMINAL OR WEB PREVIEW */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0d131f", minWidth: "350px" }}>
          {mode === "compiler" ? (
            <>
              {/* Console Navigation Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#0a0e17",
                  borderBottom: "1px solid #1e293b",
                  padding: "0 12px",
                  height: "38px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>📟 Execution Output</span>
                  </span>

                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#94a3b8", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={showStdinBox}
                      onChange={(e) => setShowStdinBox(e.target.checked)}
                      style={{ accentColor: "#0284c7" }}
                    />
                    <span>Input (STDIN) Box</span>
                    {stdin.trim() && <span style={{ color: "#38bdf8", fontWeight: 800 }}>•</span>}
                  </label>
                </div>

                {result && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: result.status === "success" ? "#065f46" : "#7f1d1d",
                        color: "#ffffff",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {result.status}
                    </span>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>{result.executionTimeMs}ms</span>
                  </div>
                )}
              </div>

              {/* Console Body: Top STDIN Box (if enabled) + Bottom Output Terminal */}
              <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* 1. Custom STDIN Input Drawer */}
                {showStdinBox && (
                  <div
                    style={{
                      height: "120px",
                      background: "#0a0f1d",
                      borderBottom: "1px solid #1e293b",
                      display: "flex",
                      flexDirection: "column",
                      padding: "8px 12px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8" }}>
                        📥 Custom Input (STDIN) — Fed into Scanner, cin, scanf, input()
                      </span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => setStdin("Alex Rivera\n21\n")}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#94a3b8",
                            fontSize: "10px",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          + Sample Input
                        </button>
                        {stdin && (
                          <button
                            type="button"
                            onClick={() => setStdin("")}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#64748b",
                              fontSize: "10px",
                              cursor: "pointer",
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                    <textarea
                      value={stdin}
                      onChange={(e) => setStdin(e.target.value)}
                      placeholder="Type inputs here (one per line, e.g.&#10;Alex Rivera&#10;21)"
                      style={{
                        flex: 1,
                        background: "#060911",
                        color: "#e2e8f0",
                        border: "1px solid #1f293d",
                        borderRadius: "4px",
                        padding: "6px 10px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        resize: "none",
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                {/* 2. Terminal Output (STDOUT / STDERR) */}
                <div
                  style={{
                    flex: 1,
                    background: "#080c14",
                    padding: "16px",
                    overflowY: "auto",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    fontSize: "12px",
                    lineHeight: "1.5",
                  }}
                >
                  {isRunning ? (
                    <div style={{ color: "#38bdf8", padding: "20px 0" }}>
                      ⚡ Compiling and executing in isolated native runtime...
                    </div>
                  ) : !result ? (
                    <div style={{ color: "#475569", padding: "40px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>▶</div>
                      <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "4px" }}>Click "Run" to execute code</div>
                      <p style={{ margin: 0, fontSize: "11px" }}>Supports standard input, dynamic memory, and algorithms.</p>
                    </div>
                  ) : (
                    <div>
                      {/* Smart Missing Input Helper (NoSuchElementException / EOFError) */}
                      {result.stderr &&
                        (result.stderr.includes("NoSuchElementException") ||
                          result.stderr.includes("EOFError") ||
                          result.stderr.includes("end of file")) &&
                        !stdin.trim() && (
                          <div
                            style={{
                              background: "rgba(245, 158, 11, 0.12)",
                              border: "1px solid #f59e0b",
                              borderRadius: "8px",
                              padding: "14px",
                              marginBottom: "16px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "#fbbf24",
                                fontWeight: 800,
                                fontSize: "13px",
                                marginBottom: "4px",
                              }}
                            >
                              <span>💡 Missing Input in STDIN</span>
                            </div>
                            <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#fef3c7", lineHeight: 1.5 }}>
                              Your program called <code>Scanner.nextLine()</code> or standard input, but the <b>Custom Input (STDIN)</b> box was empty! In online compilers, inputs must be entered into the STDIN box before clicking Run.
                            </p>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowStdinBox(true);
                                  setStdin("Alex Rivera\n21\n");
                                }}
                                style={{
                                  background: "#f59e0b",
                                  color: "#0f172a",
                                  border: "none",
                                  padding: "5px 12px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                Insert Sample Input ("Alex Rivera\n21")
                              </button>
                            </div>
                          </div>
                        )}

                      {result.compilationError && (
                        <div style={{ marginBottom: "12px" }}>
                          <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: "4px" }}>Compilation Error:</div>
                          <pre style={{ margin: 0, color: "#fca5a5", whiteSpace: "pre-wrap" }}>{result.compilationError}</pre>
                        </div>
                      )}

                      {result.stderr && !result.compilationError && (
                        <div style={{ marginBottom: "12px" }}>
                          <div style={{ color: "#f59e0b", fontWeight: 700, marginBottom: "4px" }}>Standard Error (STDERR):</div>
                          <pre style={{ margin: 0, color: "#fcd34d", whiteSpace: "pre-wrap" }}>{result.stderr}</pre>
                        </div>
                      )}

                      {result.stdout ? (
                        <div>
                          <div style={{ color: "#10b981", fontWeight: 700, marginBottom: "4px" }}>Standard Output (STDOUT):</div>
                          <pre style={{ margin: 0, color: "#f8fafc", whiteSpace: "pre-wrap" }}>{result.stdout}</pre>
                        </div>
                      ) : (
                        !result.compilationError &&
                        !result.stderr && (
                          <div style={{ color: "#64748b", fontStyle: "italic" }}>Program exited normally with empty output.</div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Web Sandbox Navigation */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#0a0e17",
                  borderBottom: "1px solid #1e293b",
                  padding: "0 12px",
                }}
              >
                <div style={{ display: "flex", gap: "2px" }}>
                  <button
                    type="button"
                    onClick={() => setWebRightTab("preview")}
                    style={{
                      padding: "8px 14px",
                      background: webRightTab === "preview" ? "#0d131f" : "transparent",
                      color: webRightTab === "preview" ? "#10b981" : "#64748b",
                      border: "none",
                      borderBottom: webRightTab === "preview" ? "2px solid #10b981" : "2px solid transparent",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🖥 Live Output
                  </button>
                  <button
                    type="button"
                    onClick={() => setWebRightTab("console")}
                    style={{
                      padding: "8px 14px",
                      background: webRightTab === "console" ? "#0d131f" : "transparent",
                      color: webRightTab === "console" ? "#38bdf8" : "#64748b",
                      border: "none",
                      borderBottom: webRightTab === "console" ? "2px solid #38bdf8" : "2px solid transparent",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    📟 Console ({webConsoleLogs.length})
                  </button>
                </div>

                {webRightTab === "console" && (
                  <button
                    type="button"
                    onClick={() => setWebConsoleLogs([])}
                    style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "11px", cursor: "pointer" }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Web Content Body */}
              <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1, display: webRightTab === "preview" ? "flex" : "none", background: "#ffffff" }}>
                  <iframe
                    ref={iframeRef}
                    title="Standalone Web Preview"
                    sandbox="allow-scripts allow-modals"
                    style={{ width: "100%", height: "100%", border: "none", background: "#ffffff" }}
                  />
                </div>

                {webRightTab === "console" && (
                  <div
                    style={{
                      flex: 1,
                      background: "#080c14",
                      padding: "12px",
                      overflowY: "auto",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      fontSize: "12px",
                    }}
                  >
                    {webConsoleLogs.length === 0 ? (
                      <div style={{ color: "#475569", padding: "16px", textAlign: "center" }}>
                        Console is empty. Run code or call <code>console.log()</code> to see logs.
                      </div>
                    ) : (
                      webConsoleLogs.map((log) => (
                        <div
                          key={log.id}
                          style={{
                            padding: "4px 6px",
                            borderBottom: "1px solid #172033",
                            display: "flex",
                            gap: "8px",
                            color: log.type === "error" ? "#ef4444" : log.type === "warn" ? "#f59e0b" : "#e2e8f0",
                          }}
                        >
                          <span style={{ color: "#475569", fontSize: "10px" }}>{log.time}</span>
                          <span style={{ fontWeight: 700, fontSize: "10px", textTransform: "uppercase" }}>[{log.type}]</span>
                          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{log.text}</pre>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
