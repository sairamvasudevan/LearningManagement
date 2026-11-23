/**
 * Offline DSA Silly Mistake & Mocking Commentary Generator
 * 
 * Provides witty, humorous, but educational "Senior SDE Tough Love"
 * and silly mistake detection for student DSA submissions and test runs.
 * 100% offline — uses smart heuristic pattern detection on inputs, outputs,
 * code syntax, and error diagnostics without any external API calls.
 */

export interface DsaMockFeedback {
  badge: string;
  headline: string;
  mock: string;
  sillyMistake: string;
  hint: string;
}

interface MockParams {
  problemId: string;
  status: string;
  code?: string;
  language?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  results?: Array<{
    id?: string | number;
    input?: string;
    expected?: string;
    actual?: string;
    error?: string;
    passed?: boolean;
  }>;
  compileOutput?: string;
  stderr?: string;
}

export function getDsaMockComment(params: MockParams): DsaMockFeedback | null {
  const { problemId, status, code = "", results = [], compileOutput = "", stderr = "" } = params;

  // No mock needed if fully passed
  if (status === "ACCEPTED" || (status === "SUCCESS" && results.length > 0 && results.every((r) => r.passed))) {
    return null;
  }

  const failedResult = results.find((r) => !r.passed) || results[0];
  const actualOutput = (failedResult?.actual || "").trim();
  const expectedOutput = (failedResult?.expected || "").trim();
  const rawInput = (failedResult?.input || "").trim();
  const lowerCode = code.toLowerCase();
  const lowerCompile = (compileOutput + " " + stderr).toLowerCase();

  // 1. COMPILE ERROR CHECKS
  if (status === "COMPILE_ERROR" || lowerCompile.includes("error:") || lowerCompile.includes("syntaxerror")) {
    if (lowerCompile.includes("expected ';'") || lowerCompile.includes("missing ;")) {
      return {
        badge: "🪦 THE MISSING SEMICOLON",
        headline: "A $200,000 engineering degree, stopped by a single ';'",
        mock: "The compiler is having a nervous breakdown because you forgot a semicolon. It's sitting right there on your keyboard next to the 'L' key!",
        sillyMistake: "Missing semicolon at the end of a statement. The parser ran your lines together into gibberish.",
        hint: "Check the compiler error line number below and terminate your statements properly.",
      };
    }

    if (lowerCompile.includes("undefined") || lowerCompile.includes("cannot find symbol") || lowerCompile.includes("not declared")) {
      return {
        badge: "👻 PHANTOM VARIABLE DETECTED",
        headline: "You used a variable that only exists in your dreams!",
        mock: "Did you declare this variable or were you just hoping the compiler would manifest it through telepathy?",
        sillyMistake: "Typo in variable name or variable used outside its declared scope.",
        hint: "Verify spelling and check that variables are declared before they are accessed.",
      };
    }

    return {
      badge: "📜 COMPILER REJECTION",
      headline: "The compiler took one look and said 'Nope!'",
      mock: "The compiler refused to even touch this code. Read the compiler diagnostics below—it literally tells you the exact line and character that broke it!",
      sillyMistake: "Syntax error, type mismatch, or missing library import/header.",
      hint: "Read the compiler output carefully line by line. Fix the first error listed—often subsequent errors are just cascade effects.",
    };
  }

  // 2. TIME LIMIT EXCEEDED CHECKS
  if (status === "TIME_LIMIT_EXCEEDED" || lowerCompile.includes("timed out") || lowerCompile.includes("timeout")) {
    if (lowerCode.includes("for") && (lowerCode.match(/for/g) || []).length >= 2) {
      return {
        badge: "🐢 O(N²) TURTLE ALERT",
        headline: "O(N²)? In this economy?!",
        mock: "Your nested for-loops are so slow that new stars are forming in the cosmos while it finishes. With N = 100,000, N² is 10 BILLION operations!",
        sillyMistake: "Brute-forcing every pair with nested loops instead of using an O(N) Hash Map or Two Pointers.",
        hint: "In interview questions, nested loops are usually a trap. Ask yourself: 'Can I trade O(N) extra memory for O(N) time using a Hash Table?'",
      };
    }

    return {
      badge: "⏳ INFINITE PATIENCE REQUIRED",
      headline: "We ordered food, ate it, took a nap, and your loop is still spinning!",
      mock: "Your while loop is having an existential crisis and never terminating. Did you forget to increment your loop counter?",
      sillyMistake: "Infinite while loop (e.g., `while (i < n)` without `i++` inside the block) or unoptimized recursion.",
      hint: "Trace your loop termination conditions with small inputs to verify the pointer or index actually moves forward.",
    };
  }

  // 3. RUNTIME ERROR / SEGFAULT CHECKS
  if (status === "RUNTIME_ERROR" || lowerCompile.includes("segmentation fault") || lowerCompile.includes("indexoutofbounds") || lowerCompile.includes("nullpointer")) {
    if (lowerCompile.includes("segmentation fault") || lowerCompile.includes("sigsegv")) {
      return {
        badge: "💥 POINTER WENT TO NARNIA",
        headline: "Segmentation Fault (SIGSEGV)!",
        mock: "Your pointer just took a wild vacation outside the memory bounds assigned to your process and macOS shut you down!",
        sillyMistake: "Dereferencing a NULL pointer, accessing an unallocated array index, or accessing `nums[i]` when `i >= n`.",
        hint: "Check array bounds: valid indices are strictly `0` to `n - 1`. If using pointers, check `ptr != NULL` before dereferencing.",
      };
    }

    if (lowerCompile.includes("indexoutofbounds") || lowerCompile.includes("indexerror")) {
      return {
        badge: "🚧 OFF THE CLIFF",
        headline: "Index Out Of Bounds!",
        mock: "You asked for index [n] or index [-1] from an array that only has [0 .. n-1]. The array looked at you with sheer confusion.",
        sillyMistake: "Classic off-by-one in loop condition: `i <= n` instead of `i < n`.",
        hint: "Arrays in C, C++, Java, and Python are 0-indexed. The last valid element is at `n - 1`.",
      };
    }

    return {
      badge: "💥 CRASH LANDING",
      headline: "Runtime Crash Detected!",
      mock: "Your program crashed midway through execution. Division by zero, stack overflow, or invalid memory access?",
      sillyMistake: "Unchecked edge case causing an illegal CPU operation at runtime.",
      hint: "Check inputs where N is small (1 or 0) or values are 0 (e.g. division by zero).",
    };
  }

  // 4. PROBLEM-SPECIFIC SILLY MISTAKES
  if (problemId === "two-sum") {
    // Check if student returned the values instead of indices
    const inputParts = rawInput.split(/\s+/);
    if (inputParts.length >= 4) {
      const numbersInArray = inputParts.slice(2);
      const actualParts = actualOutput.split(/\s+/);
      const returnedValuesInsteadOfIndices = actualParts.some((p) => numbersInArray.includes(p) && !["0", "1"].includes(p));
      if (returnedValuesInsteadOfIndices) {
        return {
          badge: "🤦 VALUES vs INDICES TRAP",
          headline: "You returned the numbers instead of their indices!",
          mock: `You printed the array values '${actualOutput}', but the question explicitly asked for the 0-based INDICES (like '0 1')! The interviewer is facepalming right now!`,
          sillyMistake: "Printing `nums[i]` and `nums[j]` instead of printing `i` and `j`.",
          hint: "The question asks for the 0-based indices: 'return the 0-based indices of the two numbers'. Print `i` and `j`, not the values!",
        };
      }
    }

    // Check if student returned 1-based indices instead of 0-based
    if (expectedOutput === "0 1" && (actualOutput === "1 2" || actualOutput === "1 2\n")) {
      return {
        badge: "📐 CLASSIC OFF-BY-ONE",
        headline: "Off-by-one! This isn't MATLAB or Excel!",
        mock: "Computers start counting from 0, not 1! You returned (1, 2) instead of (0, 1). Someone has been writing too much Lua or R!",
        sillyMistake: "Adding +1 to your indices or starting your loop at 1.",
        hint: "Keep indices 0-based: `0 1`, not `1 2`.",
      };
    }

    // Check if student used the same index twice
    const parts = actualOutput.split(/\s+/);
    if (parts.length >= 2 && parts[0] === parts[1]) {
      return {
        badge: "👯 NO CLONING ALLOWED",
        headline: "You used the exact same element twice!",
        mock: `You picked index ${parts[0]} twice and called it a day! The problem states: 'you may not use the same element twice'.`,
        sillyMistake: "Your pair loop allowed `i == j`, or your Hash Map lookup matched the element with itself.",
        hint: "In nested loops, start inner loop at `j = i + 1`. In a Hash Map, check `seen[complement] != i` before returning.",
      };
    }

    // Check for reversed indices
    if (expectedOutput.split(" ").reverse().join(" ") === actualOutput) {
      return {
        badge: "🔄 REVERSED INDICES",
        headline: "Your indices are doing a backflip!",
        mock: `You printed '${actualOutput}' when '${expectedOutput}' was expected. Ascending order, my friend!`,
        sillyMistake: "Printing the indices in descending order instead of ascending order.",
        hint: "Ensure the smaller index is printed first: `min(i, j)` then `max(i, j)`.",
      };
    }

    // Empty output
    if (!actualOutput) {
      return {
        badge: "🫥 GHOST OUTPUT",
        headline: "Nothing! Nada! Radio silence!",
        mock: "Your code ran and returned absolutely nothing to stdout. Did you forget to print or did your return statement jump the gun?",
        sillyMistake: "No `printf`, `cout`, `System.out.println`, or `print()` called, or loop never found a match.",
        hint: "Print the indices separated by a space and a newline: `print(f'{i} {j}')` or `cout << i << ' ' << j << endl;`.",
      };
    }

    return {
      badge: "🎯 TARGET MISSED",
      headline: "Math has left the chat!",
      mock: `Expected pair indices for sum, but your code gave '${actualOutput}'. Are you sure those two numbers add up to the target?`,
      sillyMistake: "Logic error in finding complement or handling duplicate values in the array.",
      hint: "For each number `x`, you need to find if `target - x` exists at a different index. Use a single-pass Hash Map for O(N) speed.",
    };
  }

  if (problemId === "valid-parentheses") {
    if (actualOutput.toLowerCase() === "true" && expectedOutput.toLowerCase() === "false") {
      return {
        badge: "🚪 UNCLOSED BRACKETS LEFT OPEN",
        headline: "You left the front door wide open!",
        mock: "Your code approved an unbalanced bracket string! Did you forget that all opened brackets MUST be closed before returning true?",
        sillyMistake: "Returning `true` simply because no mismatched closing bracket occurred, forgetting to check if the stack is completely empty at the end.",
        hint: "At the end of your function, return `stack.empty()` (or `len(st) == 0`). If anything remains on the stack, return `false`!",
      };
    }

    if (actualOutput.toLowerCase() === "false" && expectedOutput.toLowerCase() === "true") {
      return {
        badge: "🚫 PREMATURE REJECTION",
        headline: "You rejected a perfectly valid pair of brackets!",
        mock: "The string was totally valid like '{[]}', but your code panicked and screamed false! Did you pop the wrong bracket type?",
        sillyMistake: "Mismatched bracket pair mapping or popping before checking opening bracket types.",
        hint: "Map `)` to `(`, `}` to `{`, and `]` to `[`. Only pop when `stack.top()` exactly equals the matching opening bracket.",
      };
    }

    return {
      badge: "🧶 SPAGHETTI BRACKETS",
      headline: "Your bracket stack is tangled!",
      mock: `Expected '${expectedOutput}' but got '${actualOutput}'. Stack LIFO (Last-In, First-Out) invariant violated!`,
      sillyMistake: "Trying to count open/close brackets with integers instead of maintaining order in a Stack data structure.",
      hint: "A counter cannot detect ordering violations like `([)]`. You MUST use a Stack to enforce nesting order.",
    };
  }

  if (problemId === "maximum-subarray") {
    if (actualOutput === "0" && expectedOutput.startsWith("-")) {
      return {
        badge: "📉 ALL-NEGATIVE TRAP",
        headline: "Kadane is facepalming right now!",
        mock: `When all numbers are negative, you returned 0! But a non-empty subarray MUST pick at least one number! Expected: ${expectedOutput}, got: 0.`,
        sillyMistake: "Initializing `max_so_far = 0` instead of `nums[0]`. If all numbers are negative, the answer is the largest negative number, NOT 0!",
        hint: "Initialize `max_so_far = nums[0]` and `current_sum = nums[0]`, then iterate from index 1. Never initialize max sum to 0!",
      };
    }

    return {
      badge: "📊 KADANE DERAILED",
      headline: "Maximum subarray sum calculation went off track!",
      mock: `Your running sum got confused. Expected '${expectedOutput}' but computed '${actualOutput}'.`,
      sillyMistake: "Resetting current sum at the wrong condition or updating global max at the wrong time.",
      hint: "At each element: `current_sum = max(nums[i], current_sum + nums[i])`, then `max_so_far = max(max_so_far, current_sum)`.",
    };
  }

  if (problemId === "longest-substring-without-repeating-characters") {
    return {
      badge: "🧱 SLIDING WINDOW OR BRICK WALL?",
      headline: "Your sliding window got stuck!",
      mock: `Expected length '${expectedOutput}' but got '${actualOutput}'. Did your left window pointer jump backwards?`,
      sillyMistake: "Updating left pointer with `left = last_pos[char] + 1` without doing `max(left, ...)`.",
      hint: "If the duplicate character was seen before the start of the current window, do not move the left pointer backwards! Use `left = max(left, last_pos[c] + 1)`.",
    };
  }

  if (problemId === "reverse-linked-list") {
    return {
      badge: "⛓️ ORPHANED NODE DISASTER",
      headline: "You severed the link and lost the list!",
      mock: "Overwrote `curr.next` before caching the next node? The rest of your linked list is now floating in outer space!",
      sillyMistake: "Reassigning pointers in the wrong sequence during node reversal.",
      hint: "Always save next first: `next = curr.next; curr.next = prev; prev = curr; curr = next;` and finally return `prev`.",
    };
  }

  if (problemId === "coin-change") {
    if (actualOutput === "0" && expectedOutput !== "0") {
      return {
        badge: "🪙 FREE COINS FOR EVERYONE",
        headline: "Did you initialize DP table with zeros?",
        mock: "If your DP array is filled with 0s, `min(dp[i], dp[i - coin] + 1)` will always pick 0! You're giving away coins for free!",
        sillyMistake: "Initializing min DP table with 0 instead of infinity (or `amount + 1`).",
        hint: "Initialize `dp[0] = 0` and all other entries `dp[1..amount] = amount + 1`. If `dp[amount] > amount`, return -1.",
      };
    }

    return {
      badge: "🪙 CHANGE SHORTAGE",
      headline: "Wrong coin count computed!",
      mock: `Expected '${expectedOutput}' coins, but your cash register dispensed '${actualOutput}'.`,
      sillyMistake: "Greedy approach fails on coin systems! You must use Dynamic Programming.",
      hint: "A greedy approach fails on coins like [1, 3, 4] for amount 6 (greedy picks 4+1+1=3 coins, optimal DP is 3+3=2 coins). Use DP!",
    };
  }

  // 5. UNIVERSAL WRONG ANSWER FALLBACK
  return {
    badge: "🎯 SILLY MISTAKE DETECTED",
    headline: "Your code ran confidently... in the wrong direction!",
    mock: `Expected '${expectedOutput}', but your code confidently produced '${actualOutput || "(Empty)"}'. At least it was confident!`,
    sillyMistake: "Output mismatch with expected invariant. Check boundary conditions and whitespace formatting.",
    hint: "Compare your Actual Output with the Expected Output above. Dry-run your algorithm with the sample input on scratch paper.",
  };
}
