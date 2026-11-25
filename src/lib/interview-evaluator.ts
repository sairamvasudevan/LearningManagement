import {
  HiringRecommendation,
  InterviewFeedback,
  InterviewMessage,
  InterviewSession,
  InterviewStage,
  RubricDimension,
} from "./interview-types";
import { getBotById, getQuestionById } from "./interview-bots";

interface TurnEvaluationResult {
  updatedSession: InterviewSession;
  botMessage: InterviewMessage;
  concluded: boolean;
}

export function evaluateCandidateTurn(params: {
  session: InterviewSession;
  candidateText?: string;
  code?: string;
  language?: string;
  concludeNow?: boolean;
}): TurnEvaluationResult {
  const { session, candidateText = "", code, language, concludeNow = false } = params;
  const bot = getBotById(session.botId);
  const question = getQuestionById(session.questionId);

  const cleanText = candidateText.trim();
  const currentCode = code !== undefined ? code : session.code;
  const currentLanguage = language || session.language || "python";

  // Build candidate message if text or code provided
  const now = new Date().toISOString();
  const messages = [...session.messages];

  if (cleanText || (code && code !== session.code)) {
    const candidateMsg: InterviewMessage = {
      id: `msg-${Date.now()}-cand`,
      sender: "candidate",
      text: cleanText || "Here is my updated implementation.",
      stage: session.stage,
      codeSnippet: code && code !== session.code ? code : undefined,
      timestamp: now,
    };
    messages.push(candidateMsg);
  }

  // If user requests to conclude, or turns exceeded limit (e.g. 10 turns)
  if (concludeNow || session.turnCount >= 12) {
    const concludedSession: InterviewSession = {
      ...session,
      stage: "CONCLUDED",
      messages,
      code: currentCode,
      language: currentLanguage,
      status: "concluded",
      turnCount: session.turnCount + 1,
      updatedAt: now,
    };

    const feedback = generateInterviewScorecard(concludedSession);
    concludedSession.feedback = feedback;

    const wrapUpText = getWrapUpMessage(bot.personality, feedback.overallScore, feedback.recommendation);
    const wrapUpMsg: InterviewMessage = {
      id: `msg-${Date.now()}-bot-wrap`,
      sender: "bot",
      text: wrapUpText.text,
      audioScript: wrapUpText.audio,
      stage: "CONCLUDED",
      timestamp: new Date().toISOString(),
    };
    concludedSession.messages.push(wrapUpMsg);

    return {
      updatedSession: concludedSession,
      botMessage: wrapUpMsg,
      concluded: true,
    };
  }

  // Determine stage progression and bot reply
  let nextStage: InterviewStage = session.stage;
  const lower = cleanText.toLowerCase();

  // Keyword intents
  const isClarification =
    session.stage === "INTRO" ||
    session.stage === "CLARIFICATION" ||
    lower.includes("sorted") ||
    lower.includes("duplicate") ||
    lower.includes("negative") ||
    lower.includes("constraint") ||
    lower.includes("empty") ||
    cleanText.endsWith("?");

  const hasApproachKeywords =
    lower.includes("o(n") ||
    lower.includes("o(1") ||
    lower.includes("hash") ||
    lower.includes("pointer") ||
    lower.includes("stack") ||
    lower.includes("sliding") ||
    lower.includes("approach") ||
    lower.includes("brute force") ||
    lower.includes("bfs") ||
    lower.includes("dfs") ||
    lower.includes("complexity") ||
    lower.includes("linear");

  const hasCodeSubmission =
    (code && code.length > 30) ||
    lower.includes("def ") ||
    lower.includes("function") ||
    lower.includes("class ") ||
    lower.includes("return ");

  // Advance stage logic
  if (session.stage === "INTRO") {
    nextStage = isClarification ? "CLARIFICATION" : hasApproachKeywords ? "APPROACH" : "CLARIFICATION";
  } else if (session.stage === "CLARIFICATION") {
    if (hasApproachKeywords) {
      nextStage = "APPROACH";
    } else if (hasCodeSubmission) {
      nextStage = "CODING";
    }
  } else if (session.stage === "APPROACH") {
    if (hasCodeSubmission || lower.includes("write code") || lower.includes("start coding") || lower.includes("ready to code")) {
      nextStage = "CODING";
    } else {
      nextStage = "GRILL"; // probe the approach
    }
  } else if (session.stage === "CODING") {
    nextStage = "GRILL";
  } else if (session.stage === "GRILL") {
    // Continue grilling or transition if satisfied
    nextStage = session.turnCount >= 5 ? "GRILL" : "GRILL";
  }

  const hasExplicitCodeSubmission = Boolean(code && code !== session.code && code.trim().length > 30);

  // Generate bot conversational dialogue & speech
  const botReply = synthesizeBotResponse({
    bot,
    question,
    stage: nextStage,
    candidateText: cleanText,
    code: currentCode,
    hasExplicitCodeSubmission,
    turnCount: session.turnCount,
    previousMessages: messages,
  });

  const botMsg: InterviewMessage = {
    id: `msg-${Date.now()}-bot`,
    sender: "bot",
    text: botReply.text,
    audioScript: botReply.audio,
    stage: nextStage,
    timestamp: new Date().toISOString(),
  };
  messages.push(botMsg);

  const updatedSession: InterviewSession = {
    ...session,
    stage: nextStage,
    messages,
    code: currentCode,
    language: currentLanguage,
    turnCount: session.turnCount + 1,
    updatedAt: now,
  };

  return {
    updatedSession,
    botMessage: botMsg,
    concluded: false,
  };
}

interface BotResponsePayload {
  text: string;
  audio: string;
}

function synthesizeBotResponse(params: {
  bot: ReturnType<typeof getBotById>;
  question: ReturnType<typeof getQuestionById>;
  stage: InterviewStage;
  candidateText: string;
  code: string;
  hasExplicitCodeSubmission: boolean;
  turnCount: number;
  previousMessages: InterviewMessage[];
}): BotResponsePayload {
  const { bot, question, stage, candidateText, code, hasExplicitCodeSubmission, turnCount } = params;
  const lower = candidateText.toLowerCase();

  const isGreeting =
    lower.includes("hello") ||
    lower.includes("hi ") ||
    lower === "hi" ||
    lower.includes("hey") ||
    lower.includes("good evening") ||
    lower.includes("good morning") ||
    lower.includes("good afternoon") ||
    lower.includes("how are you") ||
    lower.includes("greetings") ||
    lower.includes("nice to meet");

  const isCasualChat =
    lower.includes("chat") ||
    lower.includes("talk") ||
    lower.includes("joke") ||
    lower.includes("who are you") ||
    lower.includes("what can you do") ||
    lower.includes("model");

  const hasTechnicalContent =
    Object.keys(question.clarificationAnswers).some((k) => lower.includes(k)) ||
    question.grillProbes.some((p) => p.triggerKeywords.some((kw) => lower.includes(kw))) ||
    lower.includes("sort") ||
    lower.includes("duplicate") ||
    lower.includes("negative") ||
    lower.includes("o(") ||
    lower.includes("complexity") ||
    lower.includes("approach") ||
    lower.includes("brute force") ||
    lower.includes("hash") ||
    lower.includes("linear") ||
    lower.includes("pointer") ||
    lower.includes("stack") ||
    hasExplicitCodeSubmission;

  // 1. Natural greeting exchange & credit notification when model is not connected
  if ((isGreeting || isCasualChat) && !hasTechnicalContent) {
    return {
      text: `Hello! Good evening! Great to meet you. Welcome to your technical interview session!

⚠️ **Model Status & Credit Notice**: We do not currently have a live external AI LLM model connected on this deployment. To continue an extended multi-turn deep live conversation with AI models, please add interview credits to your account (you can top up passes anytime via the '+ Recharge' button above).

For now, you can test our algorithmic interview flow: ask about problem constraints (such as whether the array is sorted), explain your Big-O approach, or write and submit your solution in the code editor on the right!`,
      audio: `Hello! Good evening! Great to meet you. Welcome to your technical interview session. Please note that an external AI model is not connected at this moment. Please add interview credits to your account to continue full AI chatting when models are live. For now, you can ask about constraints, explain your approach, or submit your code in the editor!`,
    };
  }

  // 2. Casual non-technical follow-up prompts candidate to add credits or proceed to problem
  if (!hasTechnicalContent && turnCount >= 1 && stage === "CLARIFICATION") {
    return {
      text: `Good evening! As a reminder, live conversational AI chatting is currently paused because an external model is not connected. Please add credits to your account to enable full AI model chatting once live.

To continue your mock interview on **${question.title}**:
1. Clarify constraints (e.g., "is the array sorted?", "can numbers be negative?")
2. Propose your algorithmic approach and time/space complexity (e.g., O(N) with Hash Map)
3. Or write and submit your code in the solution editor on the right!`,
      audio: `Good evening. Live conversational chatting is paused because an external model is not connected. Please add credits to continue chatting. You can clarify constraints, propose your approach, or submit your code in the editor.`,
    };
  }

  // 3. Check for specific question clarifications
  for (const [key, answer] of Object.entries(question.clarificationAnswers)) {
    if (lower.includes(key)) {
      if (bot.personality === "supportive") {
        return {
          text: `Great question! ${answer} Keeping constraints in mind is super helpful. How would you like to solve it?`,
          audio: `Great question. ${answer} How do you want to solve it?`,
        };
      }
      if (bot.personality === "ruthless") {
        return {
          text: `Good catch on constraints, but let's not linger. ${answer} Now, what is your optimal time complexity target? Don't even think about quadratic solutions.`,
          audio: `Good catch. ${answer} Now, what is your optimal time complexity target? No quadratic solutions.`,
        };
      }
      return {
        text: `Regarding that constraint: ${answer} Now, what approach are you proposing to handle this?`,
        audio: `Regarding that constraint: ${answer} What approach are you proposing?`,
      };
    }
  }

  // 2. Check for grill probes matching candidate keywords
  for (const probe of question.grillProbes) {
    const matched = probe.triggerKeywords.some((kw) => lower.includes(kw));
    if (matched) {
      if (bot.personality === "supportive") {
        return {
          text: `You're on the right track! Just one small edge case to consider: ${probe.probeQuestion} Take your time to think it through!`,
          audio: `You're on the right track. One small edge case: ${probe.probeAudioScript}`,
        };
      }
      if (bot.personality === "ruthless") {
        return {
          text: `Hold on right there. ${probe.probeQuestion} If this hits production under heavy traffic, your service will melt down. Defend your design.`,
          audio: `Hold on right there. ${probe.probeAudioScript} Defend your design.`,
        };
      }
      return {
        text: `That's an interesting direction. But consider this: ${probe.probeQuestion} How does your solution guard against that?`,
        audio: `Interesting direction. But consider this: ${probe.probeAudioScript}`,
      };
    }
  }

  // 3. Stage-specific contextual dialogues
  if (stage === "CLARIFICATION") {
    if (bot.personality === "supportive") {
      return {
        text: `Good question! Feel free to ask anything about input bounds, duplicate items, or edge cases. Once you're comfortable, share your high-level strategy!`,
        audio: `Good question. Feel free to ask about bounds, duplicates, or edge cases. Once ready, tell me your high level strategy.`,
      };
    }
    if (bot.personality === "ruthless") {
      return {
        text: `The problem statement is strict. Assume worst-case inputs and high data volume. What is the fundamental invariant your algorithm will rely on?`,
        audio: `Assume worst case inputs and high data volume. What is the fundamental invariant your algorithm relies on?`,
      };
    }
    return {
      text: `Understood. The constraints are specified in the prompt. What algorithm are you planning to use, and what is the expected time and space complexity?`,
      audio: `Understood. What algorithm are you planning to use, and what is your expected time and space complexity?`,
    };
  }

  if (stage === "APPROACH") {
    if (lower.includes("brute force") || lower.includes("o(n^2)")) {
      if (bot.personality === "supportive") {
        return {
          text: `Starting with brute force is a great first step to understand the logic! But can we trade a bit of space (like using a hash table) to get it down to linear O(N) time?`,
          audio: `Brute force is a nice baseline. But can we use a hash table to get linear time?`,
        };
      }
      if (bot.personality === "ruthless") {
        return {
          text: `Unacceptable for this tier. O(N^2) brute force will instantly TLE on ${question.constraints[0]}. You need an optimal ${question.expectedOptimalTime} algorithm. What auxiliary data structure gives you that?`,
          audio: `Unacceptable for this tier. Brute force will timeout. What data structure achieves optimal linear time?`,
        };
      }
      return {
        text: `Brute force works as a baseline, but in a production environment with large inputs, we need ${question.expectedOptimalTime}. How can you optimize this?`,
        audio: `Brute force works as a baseline, but we need optimal time. How can you optimize this?`,
      };
    }

    return {
      text: `Your proposed approach sounds promising. Let's move to code! Please write your clean solution in the editor on the right and walk me through the key logic.`,
      audio: `Your approach sounds promising. Let's write the code! Write your solution and walk me through the key logic.`,
    };
  }

  if (stage === "CODING") {
    if (code && code.length > 50) {
      if (bot.personality === "demanding" || bot.personality === "ruthless") {
        return {
          text: `I see your implementation. Let's stress-test it. Look closely at your edge cases: what happens when the input reaches boundary limits or contains duplicates? Walk me through a dry run on an adversarial test case.`,
          audio: `I see your code. What happens on boundary limits or duplicate elements? Walk me through an adversarial dry run.`,
        };
      }
      return {
        text: `Nice work getting the code down. Now, let's step through it: how does it handle empty inputs or boundary values? Are there any redundant memory allocations?`,
        audio: `Nice work on the code. How does it handle boundary values or empty inputs? Walk me through line by line.`,
      };
    }
    return {
      text: `Go ahead and write the implementation in the code scratchpad. Make sure to define proper loop invariants and handle edge cases.`,
      audio: `Go ahead and write your implementation in the editor. Make sure to handle edge cases cleanly.`,
    };
  }

  if (stage === "GRILL") {
    // Select an unaddressed probe or challenge
    const probeIndex = turnCount % question.grillProbes.length;
    const probe = question.grillProbes[probeIndex];

    if (bot.personality === "ruthless") {
      return {
        text: `Let's drill deeper. ${probe.probeQuestion} Many candidates fail right here because they overlook this subtle detail. How do you prove your code doesn't break?`,
        audio: `Let's drill deeper. ${probe.probeAudioScript} How do you prove your code doesn't break?`,
      };
    }

    if (bot.personality === "demanding") {
      return {
        text: `From an infrastructure perspective: ${probe.probeQuestion} What trade-off did you make between CPU cache friendliness and asymptotic bounds?`,
        audio: `From an infrastructure perspective: ${probe.probeAudioScript} What trade-offs did you make?`,
      };
    }

    return {
      text: `Good progress! Here is a technical challenge: ${probe.probeQuestion} How would your algorithm adapt to this?`,
      audio: `Good progress! Here is a challenge: ${probe.probeAudioScript}`,
    };
  }

  // Fallback
  return {
    text: `Understood. Walk me through your reasoning step by step, and explain how your solution guarantees correctness.`,
    audio: `Understood. Walk me through your reasoning step by step.`,
  };
}

function getWrapUpMessage(personality: string, score: number, rec: HiringRecommendation): { text: string; audio: string } {
  if (personality === "ruthless") {
    if (score >= 80) {
      return {
        text: `Interview concluded. I pushed you hard on edge cases and scalability, and your defense was rigorous. You met the high bar. Verdict: ${rec}. Check your scorecard below for the detailed breakdown.`,
        audio: `Interview concluded. You defended your algorithm against hard grilling. Final verdict: ${rec}. Check your scorecard below.`,
      };
    }
    return {
      text: `Interview concluded. You struggled under the edge case stress tests, and hand-waving was exposed. Verdict: ${rec}. Review the rubric and drill the suggested improvements before your next loop.`,
      audio: `Interview concluded. You faced difficulty under rigorous grilling. Final verdict: ${rec}. Review your scorecard.`,
    };
  }

  if (personality === "supportive") {
    return {
      text: `Awesome job finishing the interview! You communicated your thoughts clearly and tackled the problem step by step. Verdict: ${rec}. I've compiled your complete scorecard and improvement tips below!`,
      audio: `Awesome job finishing the interview! You tackled the problem step by step. Final verdict: ${rec}. Check your scorecard below!`,
    };
  }

  return {
    text: `Thank you for your time today. That concludes our mock technical interview. Your final scorecard has been generated with a verdict of ${rec}. Let's look at your dimensional breakdown.`,
    audio: `Thank you for your time today. That concludes our interview with a verdict of ${rec}. Let's examine your scorecard.`,
  };
}

export function generateInterviewScorecard(session: InterviewSession): InterviewFeedback {
  const bot = getBotById(session.botId);
  const question = getQuestionById(session.questionId);

  const candidateMessages = session.messages.filter((m) => m.sender === "candidate");
  const allCandidateText = candidateMessages.map((m) => m.text).join(" ").toLowerCase();
  const code = (session.code || "").trim();

  // 1. Problem Solving (0..20)
  let psScore = 12;
  const mentionsOptimal =
    allCandidateText.includes(question.expectedOptimalTime.toLowerCase()) ||
    allCandidateText.includes("hash") ||
    allCandidateText.includes("pointer") ||
    allCandidateText.includes("sliding") ||
    allCandidateText.includes("stack") ||
    allCandidateText.includes("graph");
  if (mentionsOptimal) psScore += 5;
  if (candidateMessages.length >= 4) psScore += 3;
  psScore = Math.min(20, psScore);

  const psDim: RubricDimension = {
    score: psScore,
    max: 20,
    feedback:
      psScore >= 16
        ? `Identified the optimal ${question.expectedOptimalTime} algorithmic approach and transitioned efficiently from clarification to solution.`
        : `Identified a functional approach, but required guidance to reach the optimal ${question.expectedOptimalTime} complexity.`,
  };

  // 2. Algorithm & Code Correctness (0..20)
  let acScore = 10;
  if (code.length > 50) acScore += 5;
  if (code.includes("return ") || code.includes("return;")) acScore += 3;
  if (code.includes("for ") || code.includes("while ") || code.includes("if ")) acScore += 2;
  acScore = Math.min(20, acScore);

  const acDim: RubricDimension = {
    score: acScore,
    max: 20,
    feedback:
      acScore >= 16
        ? "Wrote structured, syntactically clean code with correct loop bounds and termination conditions."
        : "Provided foundational implementation logic, but needs attention to boundary invariants and syntax cleanliness.",
  };

  // 3. Complexity Analysis (0..20)
  let caScore = 11;
  if (allCandidateText.includes("o(n") || allCandidateText.includes("o(1") || allCandidateText.includes("o(log")) {
    caScore += 6;
  }
  if (allCandidateText.includes("space") && allCandidateText.includes("time")) {
    caScore += 3;
  }
  caScore = Math.min(20, caScore);

  const caDim: RubricDimension = {
    score: caScore,
    max: 20,
    feedback:
      caScore >= 16
        ? `Accurately articulated both Time Complexity (${question.expectedOptimalTime}) and Space Complexity (${question.expectedOptimalSpace}).`
        : "Understood general complexity behavior, but needs more precision when justifying auxiliary memory allocations.",
  };

  // 4. Grilling Defense & Edge Cases (0..20)
  let gdScore = 10;
  if (allCandidateText.includes("edge") || allCandidateText.includes("null") || allCandidateText.includes("empty") || allCandidateText.includes("duplicate")) {
    gdScore += 4;
  }
  if (allCandidateText.includes("invariant") || allCandidateText.includes("collision") || allCandidateText.includes("scale") || allCandidateText.includes("trade-off")) {
    gdScore += 4;
  }
  if (candidateMessages.length >= 5) gdScore += 2;
  gdScore = Math.min(20, gdScore);

  const gdDim: RubricDimension = {
    score: gdScore,
    max: 20,
    feedback:
      gdScore >= 16
        ? `Resiliently defended algorithm against ${bot.name}'s aggressive probes regarding boundary cases and scale limits.`
        : "Handled primary logic well, but hesitated when confronted with adversarial counterexamples and scale constraints.",
  };

  // 5. Technical Communication & Clarity (0..20)
  let ccScore = 12;
  const wordCount = allCandidateText.split(/\s+/).length;
  if (wordCount > 60) ccScore += 4;
  if (wordCount > 150) ccScore += 4;
  ccScore = Math.min(20, ccScore);

  const ccDim: RubricDimension = {
    score: ccScore,
    max: 20,
    feedback:
      ccScore >= 16
        ? "Exemplary verbal and technical communication; articulated thoughts aloud before making decisions."
        : "Good technical responses, but could explain mental models more proactively before coding.",
  };

  const overallScore = psScore + acScore + caScore + gdScore + ccScore;

  // Hiring Recommendation mapping
  let recommendation: HiringRecommendation = "No Hire";
  if (overallScore >= 85) recommendation = "Strong Hire";
  else if (overallScore >= 72) recommendation = "Hire";
  else if (overallScore >= 58) recommendation = "Lean Hire";
  else if (overallScore >= 45) recommendation = "Lean No Hire";
  else recommendation = "No Hire";

  // Performance ELO calculation: bot ELO + adjustment based on score
  const eloDelta = Math.round((overallScore - 70) * 8);
  const candidateElo = Math.max(600, Math.min(2800, bot.elo + eloDelta));

  // Strengths & Improvements
  const strengths: string[] = [];
  const improvements: string[] = [];
  const grillingHighlights: string[] = [];

  if (psScore >= 15) strengths.push(`Fast algorithmic formulation: quickly homed in on ${question.expectedOptimalTime} solution.`);
  if (caScore >= 15) strengths.push("Strong Big-O awareness: differentiated average vs worst-case asymptotic bounds.");
  if (ccScore >= 15) strengths.push("Interactive communication: asked intelligent clarifying questions prior to jumping into code.");
  if (gdScore >= 15) strengths.push(`Stood firm against ${bot.name}'s tough grilling questions without breaking.`);
  if (strengths.length === 0) strengths.push("Maintained persistence and attempted to solve all stages of the problem.");

  if (gdScore < 15) improvements.push("Practice stress-testing algorithms against empty inputs, duplicates, and integer overflow.");
  if (acScore < 15) improvements.push("Write complete executable code with proper guard clauses and zero syntax ambiguities.");
  if (caScore < 15) improvements.push("Always state both Time and Space complexity explicitly without waiting for the interviewer to ask.");
  if (improvements.length === 0) improvements.push("Challenge yourself against higher ELO interviewers (e.g., Magnus ELO 2400) for concurrency drills.");

  grillingHighlights.push(`Probed on: ${question.grillProbes[0].probeQuestion.slice(0, 80)}...`);
  if (question.grillProbes.length > 1) {
    grillingHighlights.push(`Challenged with: ${question.grillProbes[1].probeQuestion.slice(0, 80)}...`);
  }

  return {
    overallScore,
    candidateElo,
    recommendation,
    rubric: {
      problemSolving: psDim,
      algorithmCorrectness: acDim,
      complexityAnalysis: caDim,
      grillingDefense: gdDim,
      communicationClarity: ccDim,
    },
    strengths,
    improvements,
    grillingHighlights,
    summary: `Candidate completed a ${bot.tier} interview with ${bot.name} (ELO ${bot.elo}) on '${question.title}'. Attained a composite score of ${overallScore}/100 and demonstrated an estimated performance rating of ELO ${candidateElo}. Hiring recommendation: ${recommendation}.`,
    createdAt: new Date().toISOString(),
  };
}
