"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AUDIO_DSA_CHAPTERS,
  AUDIO_DSA_EPISODES,
  type AudioDsaEpisode,
  type AudioSpeakerRole,
} from "@/lib/audio-dsa-data";

interface SubmitFeedbackState {
  episodeId: string;
  episodeNumber: number;
  passed: boolean;
  persisted: boolean;
  correctIndex: number;
  feedback: string;
  technicalExplanation: string;
  recallFeedback?: {
    matchedCount: number;
    matchedKeywords: string[];
    note: string;
  };
}

interface AudioDsaStudioProps {
  initialEpisodeId?: string;
  initialCompletedIds?: string[];
  signedIn?: boolean;
}

const SPEAKER_BADGES: Record<
  AudioSpeakerRole,
  { badge: string; accent: string; bg: string; pitch: number; rateMultiplier: number }
> = {
  narrator: {
    badge: "Story Narrator",
    accent: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.14)",
    pitch: 1.0,
    rateMultiplier: 1.0,
  },
  character: {
    badge: "Hostel Scene & Drama",
    accent: "#fbbf24",
    bg: "rgba(251, 191, 36, 0.14)",
    pitch: 1.06,
    rateMultiplier: 1.03,
  },
  punchline: {
    badge: "Comedy Punchline Drop",
    accent: "#fb7185",
    bg: "rgba(251, 113, 133, 0.16)",
    pitch: 1.12,
    rateMultiplier: 1.05,
  },
  mentor: {
    badge: "Mentor Priya · Tech Breakdown",
    accent: "#34d399",
    bg: "rgba(52, 211, 153, 0.14)",
    pitch: 0.94,
    rateMultiplier: 0.96,
  },
};

function cleanTextForAudioSpeech(raw: string): string {
  return raw
    .replace(/`([^`]+)`/g, "$1")
    .replace(/O\(\(V \+ E\) log V\)/g, "O of V plus E, times log V")
    .replace(/O\(V \+ E\)/g, "O of V plus E")
    .replace(/O\(n log n\)/gi, "O of n log n")
    .replace(/O\(n log K\)/gi, "O of n log K")
    .replace(/O\(n²\)|O\(n\^2\)/gi, "O of n squared")
    .replace(/O\(2ⁿ\)|O\(2\^n\)/gi, "exponential 2 to the power n")
    .replace(/O\(n!\)/gi, "factorial O of n")
    .replace(/O\(α\(n\)\)/gi, "inverse Ackermann near constant time")
    .replace(/O\(log n\)/gi, "O of log n")
    .replace(/O\(1\)/g, "O of 1 constant time")
    .replace(/O\(n\)/gi, "O of n linear time")
    .replace(/10⁸|10\^8/g, "100 million")
    .replace(/10⁵|10\^5/g, "100 thousand")
    .replace(/arr\[i\]/gi, "array at i")
    .replace(/->/g, " to ")
    .replace(/<->/g, " connected with ")
    .replace(/<=/g, " less than or equal to ")
    .replace(/>=/g, " greater than or equal to ")
    .replace(/!=/g, " not equal to ")
    .replace(/==/g, " equals ")
    .replace(/\^/g, " XOR ")
    .replace(/—/g, ", ")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function playStudioChime(
  kind: "start" | "twist" | "scratch" | "rimshot" | "ding" | "success" | "fail",
  enabled: boolean,
) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (kind === "scratch") {
      // Quick comedic downward turntable zip before plot twist
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(720, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(190, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.19);
    } else {
      const notes =
        kind === "start"
          ? [523.25, 659.25]
          : kind === "rimshot"
          ? [440, 554.37, 659.25]
          : kind === "ding" || kind === "twist"
          ? [587.33, 783.99]
          : kind === "success"
          ? [523.25, 659.25, 783.99]
          : [311.13, 277.18];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = kind === "rimshot" ? "triangle" : "sine";
        osc.frequency.value = freq;
        const startAt = ctx.currentTime + idx * (kind === "rimshot" ? 0.065 : 0.08);
        gain.gain.setValueAtTime(0.001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.065, startAt + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt);
        osc.stop(startAt + 0.24);
      });
    }
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 650);
  } catch {
    // Ignore browser audio-context autoplay block gracefully
  }
}

export function AudioDsaStudio({
  initialEpisodeId,
  initialCompletedIds = [],
  signedIn = false,
}: AudioDsaStudioProps) {
  const defaultEpisode =
    AUDIO_DSA_EPISODES.find((ep) => ep.id === initialEpisodeId) ||
    AUDIO_DSA_EPISODES[0];

  const [activeEpisodeId, setActiveEpisodeId] = useState<string>(defaultEpisode.id);
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(initialCompletedIds),
  );
  const [chapterFilter, setChapterFilter] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Audio player state
  const [playbackStatus, setPlaybackStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [activeSegmentIdx, setActiveSegmentIdx] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  const [eyesFreeMode, setEyesFreeMode] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>("");
  const [ttsAvailable, setTtsAvailable] = useState<boolean>(false);
  const [voiceEngine, setVoiceEngine] = useState<"natural-hd" | "browser">("natural-hd");

  // Quiz & reflection state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [reflectionText, setReflectionText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [quizFeedback, setQuizFeedback] = useState<SubmitFeedbackState | null>(null);

  const activeEpisode: AudioDsaEpisode = useMemo(
    () =>
      AUDIO_DSA_EPISODES.find((ep) => ep.id === activeEpisodeId) ||
      AUDIO_DSA_EPISODES[0],
    [activeEpisodeId],
  );

  const nextEpisode = useMemo(
    () =>
      AUDIO_DSA_EPISODES.find(
        (ep) => ep.episodeNumber === activeEpisode.episodeNumber + 1,
      ) || null,
    [activeEpisode.episodeNumber],
  );

  const prevEpisode = useMemo(
    () =>
      AUDIO_DSA_EPISODES.find(
        (ep) => ep.episodeNumber === activeEpisode.episodeNumber - 1,
      ) || null,
    [activeEpisode.episodeNumber],
  );

  const statusRef = useRef(playbackStatus);
  const rateRef = useRef(playbackRate);
  const voiceUriRef = useRef(selectedVoiceUri);
  const autoAdvanceRef = useRef(autoAdvance);
  const sfxRef = useRef(sfxEnabled);
  const voiceEngineRef = useRef(voiceEngine);
  const audioElemRef = useRef<HTMLAudioElement | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speakSegmentRef = useRef<(ep: AudioDsaEpisode, idx: number) => void>(() => {});

  useEffect(() => {
    statusRef.current = playbackStatus;
  }, [playbackStatus]);
  useEffect(() => {
    rateRef.current = playbackRate;
  }, [playbackRate]);
  useEffect(() => {
    voiceUriRef.current = selectedVoiceUri;
  }, [selectedVoiceUri]);
  useEffect(() => {
    autoAdvanceRef.current = autoAdvance;
  }, [autoAdvance]);
  useEffect(() => {
    sfxRef.current = sfxEnabled;
  }, [sfxEnabled]);
  useEffect(() => {
    voiceEngineRef.current = voiceEngine;
  }, [voiceEngine]);

  // Discover built-in English Web Speech voices offline
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    let cancelled = false;

    const loadVoices = () => {
      if (cancelled) return;
      const all = window.speechSynthesis.getVoices();
      const english = all.filter((v) => v.lang.toLowerCase().startsWith("en"));
      const pool = english.length > 0 ? english : all;
      setVoices(pool);
      setTtsAvailable(pool.length > 0);
      if (!voiceUriRef.current && pool.length > 0) {
        const preferred =
          pool.find(
            (v) =>
              v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel"),
          ) || pool[0];
        setSelectedVoiceUri(preferred.voiceURI);
      }
    };

    queueMicrotask(loadVoices);
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      cancelled = true;
      window.speechSynthesis.onvoiceschanged = null;
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Live timer progression while story audio plays
  useEffect(() => {
    if (playbackStatus !== "playing") return;
    const id = setInterval(() => {
      setElapsedSec((prev) =>
        Math.min(activeEpisode.estimatedSeconds, prev + playbackRate),
      );
    }, 1000);
    return () => clearInterval(id);
  }, [playbackStatus, playbackRate, activeEpisode.estimatedSeconds]);

  const stopAudioEngine = useCallback(() => {
    if (audioElemRef.current) {
      audioElemRef.current.pause();
      audioElemRef.current.src = "";
      audioElemRef.current = null;
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlaybackStatus("idle");
    statusRef.current = "idle";
  }, []);

  const selectEpisode = useCallback(
    (episode: AudioDsaEpisode, autoStart = false) => {
      stopAudioEngine();
      setActiveEpisodeId(episode.id);
      setActiveSegmentIdx(0);
      setElapsedSec(0);
      setSelectedOption(null);
      setShowHint(false);
      setReflectionText("");
      setSubmitError("");
      setQuizFeedback(null);
      if (autoStart) {
        setTimeout(() => {
          speakSegmentRef.current(episode, 0);
        }, 120);
      }
    },
    [stopAudioEngine],
  );

  const speakSegment = useCallback(
    (episode: AudioDsaEpisode, idx: number) => {
      if (audioElemRef.current) {
        audioElemRef.current.pause();
        audioElemRef.current.src = "";
        audioElemRef.current = null;
      }
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }

      if (idx < 0 || idx >= episode.segments.length) {
        stopAudioEngine();
        setElapsedSec(episode.estimatedSeconds);
        playStudioChime("start", sfxRef.current);
        if (autoAdvanceRef.current) {
          const next = AUDIO_DSA_EPISODES.find(
            (e) => e.episodeNumber === episode.episodeNumber + 1,
          );
          if (next) selectEpisode(next, true);
        }
        return;
      }

      const segment = episode.segments[idx];
      setActiveSegmentIdx(idx);
      setPlaybackStatus("playing");
      statusRef.current = "playing";

      if (segment.sfx) playStudioChime(segment.sfx, sfxRef.current);
      else if (idx === 0) playStudioChime("start", sfxRef.current);
      else if (segment.speaker === "mentor") playStudioChime("ding", sfxRef.current);
      else if (segment.speaker === "punchline") playStudioChime("rimshot", sfxRef.current);

      const segBase = Math.round(
        (episode.estimatedSeconds * idx) / episode.segments.length,
      );
      setElapsedSec(segBase);

      const speakerProfile = SPEAKER_BADGES[segment.speaker];

      const launchUtterance = () => {
        if (statusRef.current !== "playing") return;
        const spokenText = cleanTextForAudioSpeech(segment.text);
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.rate = Math.min(
          1.75,
          Math.max(0.65, rateRef.current * speakerProfile.rateMultiplier),
        );
        utterance.pitch = speakerProfile.pitch;

        if (voiceUriRef.current) {
          const match = window.speechSynthesis
            .getVoices()
            .find((v) => v.voiceURI === voiceUriRef.current);
          if (match) utterance.voice = match;
        }

        utterance.onend = () => {
          if (statusRef.current !== "playing") return;
          speakSegmentRef.current(episode, idx + 1);
        };

        utterance.onerror = (e) => {
          if (e.error === "canceled" || e.error === "interrupted") return;
          if (statusRef.current !== "playing") return;
          speakSegmentRef.current(episode, idx + 1);
        };

        window.speechSynthesis.speak(utterance);
      };

      const playWithNaturalVoice = () => {
        if (statusRef.current !== "playing") return;
        try {
          const streamUrl = `/api/audio-dsa/voice?text=${encodeURIComponent(
            segment.text,
          )}&speaker=${encodeURIComponent(segment.speaker)}`;
          const audio = new Audio(streamUrl);
          audio.playbackRate = rateRef.current;
          audioElemRef.current = audio;

          audio.onended = () => {
            if (statusRef.current !== "playing") return;
            speakSegmentRef.current(episode, idx + 1);
          };

          audio.onerror = () => {
            // Gracefully fall back to enhanced browser utterance if network stream fails
            launchUtterance();
          };

          audio.play().catch(() => {
            launchUtterance();
          });
        } catch {
          launchUtterance();
        }
      };

      const beatPauseMs = segment.pauseBeforeMs
        ? Math.round(segment.pauseBeforeMs / Math.max(0.6, rateRef.current))
        : 0;

      const triggerVoice =
        voiceEngineRef.current === "natural-hd" ? playWithNaturalVoice : launchUtterance;

      if (beatPauseMs > 0) {
        fallbackTimerRef.current = setTimeout(triggerVoice, beatPauseMs);
      } else {
        triggerVoice();
      }
    },
    [selectEpisode, stopAudioEngine],
  );

  useEffect(() => {
    speakSegmentRef.current = speakSegment;
  }, [speakSegment]);

  const handlePlayToggle = () => {
    if (playbackStatus === "playing") {
      if (audioElemRef.current) {
        audioElemRef.current.pause();
      }
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.pause();
      }
      setPlaybackStatus("paused");
      statusRef.current = "paused";
      return;
    }

    if (playbackStatus === "paused") {
      if (audioElemRef.current && audioElemRef.current.paused) {
        audioElemRef.current.play().catch(() => {});
        setPlaybackStatus("playing");
        statusRef.current = "playing";
        return;
      }
      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        window.speechSynthesis.paused
      ) {
        window.speechSynthesis.resume();
        setPlaybackStatus("playing");
        statusRef.current = "playing";
        return;
      }
      speakSegment(activeEpisode, activeSegmentIdx);
      return;
    }

    speakSegment(activeEpisode, 0);
  };

  const handleReadQuizAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    stopAudioEngine();
    const labels = ["A", "B", "C", "D"];
    const script = cleanTextForAudioSpeech(
      `Episode ${activeEpisode.episodeNumber} Story Challenge. ${activeEpisode.quiz.prompt} ${activeEpisode.quiz.options
        .map((opt, idx) => `Option ${labels[idx]}: ${opt}.`)
        .join(" ")}`,
    );
    const utt = new SpeechSynthesisUtterance(script);
    utt.rate = playbackRate;
    if (selectedVoiceUri) {
      const match = window.speechSynthesis
        .getVoices()
        .find((v) => v.voiceURI === selectedVoiceUri);
      if (match) utt.voice = match;
    }
    window.speechSynthesis.speak(utt);
  };

  const handleReadTechSummaryAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    stopAudioEngine();
    const comparisonSpoken = activeEpisode.comparisonRows
      .map((r) => `${r.storyElement} maps to ${r.technicalConcept}. ${r.whyItMatches}`)
      .join(" ");
    const script = cleanTextForAudioSpeech(
      `Technical Comparison for Episode ${activeEpisode.episodeNumber}: ${activeEpisode.conceptTopic}. ${comparisonSpoken} Core Rule: ${activeEpisode.technicalExplanation}`,
    );
    const utt = new SpeechSynthesisUtterance(script);
    utt.rate = playbackRate;
    utt.pitch = 0.96;
    if (selectedVoiceUri) {
      const match = window.speechSynthesis
        .getVoices()
        .find((v) => v.voiceURI === selectedVoiceUri);
      if (match) utt.voice = match;
    }
    window.speechSynthesis.speak(utt);
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null) {
      setSubmitError("Pick answer A, B, C, or D first!");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/audio-dsa/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: activeEpisode.id,
          selectedIndex: selectedOption,
          reflectionText,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Could not verify answer.");
        return;
      }
      setQuizFeedback(data as SubmitFeedbackState);
      if (data.passed) {
        playStudioChime("success", sfxEnabled);
        setCompletedIds((prev) => new Set([...prev, activeEpisode.id]));
      } else {
        playStudioChime("fail", sfxEnabled);
      }
    } catch {
      setSubmitError("Network error while checking your answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredChapters = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return AUDIO_DSA_CHAPTERS.filter(
      (ch) => chapterFilter === "all" || ch.chapterNumber === chapterFilter,
    )
      .map((ch) => ({
        ...ch,
        episodes: ch.episodes.filter(
          (ep) =>
            !q ||
            ep.title.toLowerCase().includes(q) ||
            ep.conceptTopic.toLowerCase().includes(q) ||
            ep.teaser.toLowerCase().includes(q),
        ),
      }))
      .filter((ch) => ch.episodes.length > 0);
  }, [chapterFilter, searchTerm]);

  const progressPct = Math.round(
    (completedIds.size / AUDIO_DSA_EPISODES.length) * 100,
  );
  const playerPct = Math.min(
    100,
    Math.round((elapsedSec / Math.max(1, activeEpisode.estimatedSeconds)) * 100),
  );

  return (
    <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "24px 20px 72px" }}>
      {/* Series Header Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #1b1035 0%, #0f172a 55%, #111827 100%)",
          borderRadius: "18px",
          padding: "28px",
          border: "1px solid rgba(251, 146, 60, 0.35)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={{ maxWidth: "780px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
            <span
              style={{
                background: "rgba(251, 146, 60, 0.16)",
                color: "#fdba74",
                border: "1px solid rgba(251, 146, 60, 0.4)",
                fontSize: "11px",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "99px",
                textTransform: "uppercase",
              }}
            >
              🎧 AUDIO STORY SERIAL · CODE BY EAR
            </span>
            <span
              style={{
                background: "rgba(52, 211, 153, 0.14)",
                color: "#34d399",
                border: "1px solid rgba(52, 211, 153, 0.35)",
                fontSize: "11px",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "99px",
              }}
            >
              {AUDIO_DSA_EPISODES.length} EPISODES · ~2 MIN STORIES · 100% OFFLINE ENGLISH AUDIO
            </span>
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: 900, color: "#f8fafc" }}>
            Learn All of Programming &amp; DSA Through Funny 2-Minute Audio Stories
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", lineHeight: 1.6 }}>
            Built for 19–21 campus builders: binge Aarav, Babloo &amp; Mentor Priya from midnight dorm-kettle chilli
            payasam (Ep 01) all the way through Prefix Sums, Graphs, DP &amp; Bitmasks—with comedic punchlines,
            story-to-code comparison tables, and interactive quizzes.
          </p>
        </div>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid #334155",
            borderRadius: "14px",
            padding: "16px 20px",
            minWidth: "220px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
            Season Mastery
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#fb923c", margin: "4px 0" }}>
            {completedIds.size} / {AUDIO_DSA_EPISODES.length}
          </div>
          <div
            style={{
              width: "100%",
              height: "6px",
              background: "#1e293b",
              borderRadius: "99px",
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div style={{ width: `${progressPct}%`, height: "100%", background: "#34d399" }} />
          </div>
          <div style={{ fontSize: "12px", color: "#cbd5e1" }}>
            {signedIn ? "Saved to your student account" : "Sign in to save progress across devices"}
          </div>
        </div>
      </section>

      {/* Main Split Studio */}
      <div className="audio-dsa-grid">
        {/* Left Sidebar: Serial Playlist */}
        <aside className="audio-dsa-sidebar">
          <div style={{ marginBottom: "12px" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search episode or topic (e.g. payasam, dp, heap)..."
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border-normal)",
                background: "rgba(15, 23, 42, 0.5)",
                color: "var(--text-primary)",
                fontSize: "13px",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
            <button
              type="button"
              onClick={() => setChapterFilter("all")}
              style={{
                padding: "4px 9px",
                fontSize: "11px",
                fontWeight: 700,
                borderRadius: "99px",
                border: "1px solid var(--border-normal)",
                background: chapterFilter === "all" ? "#ea580c" : "transparent",
                color: chapterFilter === "all" ? "#fff" : "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              All {AUDIO_DSA_CHAPTERS.length} Seasons
            </button>
            {AUDIO_DSA_CHAPTERS.map((ch) => (
              <button
                key={ch.chapterNumber}
                type="button"
                onClick={() => setChapterFilter(ch.chapterNumber)}
                style={{
                  padding: "4px 9px",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "99px",
                  border: "1px solid var(--border-normal)",
                  background: chapterFilter === ch.chapterNumber ? "#ea580c" : "transparent",
                  color: chapterFilter === ch.chapterNumber ? "#fff" : "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                S{ch.chapterNumber}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filteredChapters.map((ch) => (
              <div key={ch.chapterNumber}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#fdba74",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "6px",
                  }}
                >
                  {ch.title}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {ch.episodes.map((ep) => {
                    const isActive = ep.id === activeEpisode.id;
                    const isDone = completedIds.has(ep.id);
                    return (
                      <button
                        key={ep.id}
                        type="button"
                        onClick={() => selectEpisode(ep, false)}
                        style={{
                          textAlign: "left",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: isActive
                            ? "1px solid #f97316"
                            : "1px solid var(--border-normal)",
                          background: isActive
                            ? "rgba(249, 115, 22, 0.14)"
                            : "rgba(15, 23, 42, 0.35)",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: isActive ? "#fdba74" : "#94a3b8",
                              fontWeight: 700,
                            }}
                          >
                            Ep {String(ep.episodeNumber).padStart(2, "0")} · {ep.durationLabel}
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#f8fafc",
                              marginTop: "2px",
                            }}
                          >
                            {ep.title}
                          </div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                            {ep.conceptTopic}
                          </div>
                        </div>
                        {isDone && (
                          <span
                            title="Completed"
                            style={{
                              background: "rgba(16, 185, 129, 0.18)",
                              color: "#34d399",
                              fontSize: "11px",
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: "99px",
                              flexShrink: 0,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Workspace: Podcast Audio Console + Comparison + Tech + Interactive Quiz */}
        <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* 1. Audio Episode Player Card */}
          <div
            style={{
              background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
              border: "1px solid #334155",
              borderRadius: "18px",
              padding: "24px",
              color: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginBottom: "6px" }}>
                  <span
                    style={{
                      background: "#ea580c",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "2px 9px",
                      borderRadius: "99px",
                    }}
                  >
                    EPISODE {String(activeEpisode.episodeNumber).padStart(2, "0")} OF{" "}
                    {AUDIO_DSA_EPISODES.length}
                  </span>
                  <span style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: 600 }}>
                    {activeEpisode.chapterTitle} · Cast: {activeEpisode.castTag}
                  </span>
                </div>
                <h2 style={{ margin: "0 0 4px", fontSize: "23px", fontWeight: 900, color: "#f8fafc" }}>
                  {activeEpisode.title}
                </h2>
                <div style={{ fontSize: "14px", color: "#fdba74", fontWeight: 700 }}>
                  Concept: {activeEpisode.conceptTopic} · Length: {activeEpisode.durationLabel}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setEyesFreeMode((v) => !v)}
                  className="button button-quiet button-small"
                  style={{ borderColor: "#475569", color: "#e2e8f0" }}
                >
                  {eyesFreeMode ? "📖 Show Script & Tables" : "🎧 Eyes-Free Focus"}
                </button>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color: "#cbd5e1",
                    background: "rgba(15, 23, 42, 0.7)",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={autoAdvance}
                    onChange={(e) => setAutoAdvance(e.target.checked)}
                  />
                  Auto-play Next Ep
                </label>
              </div>
            </div>

            <p style={{ margin: "0 0 18px", fontSize: "13.5px", color: "#cbd5e1" }}>
              {activeEpisode.teaser}
            </p>

            {/* Podcast Controls Strip */}
            <div
              style={{
                background: "rgba(2, 6, 23, 0.72)",
                border: "1px solid #334155",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              {/* Active speaker + clock */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "9px",
                      height: "9px",
                      borderRadius: "99px",
                      background: playbackStatus === "playing" ? "#34d399" : "#94a3b8",
                    }}
                  />
                  <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#f8fafc" }}>
                    {playbackStatus === "playing"
                      ? `Now Speaking: ${activeEpisode.segments[activeSegmentIdx]?.label}`
                      : playbackStatus === "paused"
                      ? `Paused at: ${activeEpisode.segments[activeSegmentIdx]?.label}`
                      : `Ready · ${ttsAvailable ? "English Voice Active" : "Synchronized Timed Story Mode"}`}
                  </span>
                </div>
                <div style={{ fontSize: "12.5px", fontFamily: "ui-monospace, monospace", color: "#fdba74" }}>
                  {formatClock(elapsedSec)} / {activeEpisode.durationLabel}
                </div>
              </div>

              {/* Segment Progress Bar */}
              <div
                style={{
                  height: "8px",
                  background: "#1e293b",
                  borderRadius: "99px",
                  overflow: "hidden",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    width: `${playerPct}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #f97316, #fbbf24)",
                    transition: "width 0.35s ease",
                  }}
                />
              </div>

              {/* Action Buttons Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={handlePlayToggle}
                    className="button button-cn-primary"
                    style={{
                      background: playbackStatus === "playing" ? "#d97706" : "#ea580c",
                      borderColor: "#ea580c",
                      fontWeight: 800,
                      padding: "10px 20px",
                    }}
                  >
                    {playbackStatus === "playing"
                      ? "⏸ Pause Audio Story"
                      : playbackStatus === "paused"
                      ? "▶ Resume Story"
                      : "▶ Play 2-Min Audio Story"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      speakSegment(activeEpisode, Math.max(0, activeSegmentIdx - 1))
                    }
                    className="button button-quiet button-small"
                    style={{ borderColor: "#475569", color: "#e2e8f0" }}
                    title="Previous story scene"
                  >
                    ⏮ Prev Scene
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      speakSegment(
                        activeEpisode,
                        Math.min(activeEpisode.segments.length - 1, activeSegmentIdx + 1),
                      )
                    }
                    className="button button-quiet button-small"
                    style={{ borderColor: "#475569", color: "#e2e8f0" }}
                    title="Next story scene"
                  >
                    ⏭ Next Scene
                  </button>

                  {playbackStatus !== "idle" && (
                    <button
                      type="button"
                      onClick={() => {
                        stopAudioEngine();
                        setActiveSegmentIdx(0);
                        setElapsedSec(0);
                      }}
                      className="button button-quiet button-small"
                      style={{ borderColor: "#475569", color: "#f87171" }}
                    >
                      ■ Stop
                    </button>
                  )}
                </div>

                {/* Speed, Chimes, Voice Selector */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <select
                    aria-label="Audio speed"
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(Number(e.target.value))}
                    style={{
                      background: "#0f172a",
                      color: "#e2e8f0",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      padding: "6px 8px",
                      fontSize: "12px",
                    }}
                  >
                    <option value={0.85}>0.85x Calm</option>
                    <option value={1}>1.0x Normal</option>
                    <option value={1.25}>1.25x Brisk</option>
                    <option value={1.5}>1.5x Fast</option>
                  </select>

                  <select
                    aria-label="Voice audio engine"
                    value={voiceEngine}
                    onChange={(e) => {
                      stopAudioEngine();
                      setVoiceEngine(e.target.value as "natural-hd" | "browser");
                    }}
                    style={{
                      background: voiceEngine === "natural-hd" ? "rgba(52, 211, 153, 0.12)" : "#0f172a",
                      color: voiceEngine === "natural-hd" ? "#34d399" : "#e2e8f0",
                      border: `1px solid ${voiceEngine === "natural-hd" ? "rgba(52, 211, 153, 0.4)" : "#334155"}`,
                      borderRadius: "8px",
                      padding: "6px 10px",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    <option value="natural-hd">🎙️ Natural Online HD (Lively & Humane)</option>
                    <option value="browser">🔊 Browser Speech (Offline)</option>
                  </select>

                  {voiceEngine === "browser" && voices.length > 0 && (
                    <select
                      aria-label="English speaker voice"
                      value={selectedVoiceUri}
                      onChange={(e) => setSelectedVoiceUri(e.target.value)}
                      style={{
                        background: "#0f172a",
                        color: "#e2e8f0",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        padding: "6px 8px",
                        fontSize: "12px",
                        maxWidth: "165px",
                      }}
                    >
                      {voices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    type="button"
                    onClick={() => setSfxEnabled((s) => !s)}
                    style={{
                      background: sfxEnabled ? "rgba(52, 211, 153, 0.14)" : "transparent",
                      color: sfxEnabled ? "#34d399" : "#94a3b8",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      padding: "6px 9px",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {sfxEnabled ? "🔔 SFX On" : "🔕 SFX Off"}
                  </button>
                </div>
              </div>
            </div>

            {/* Active Story Caption / Interactive Segment Timeline */}
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {(eyesFreeMode
                ? [activeEpisode.segments[activeSegmentIdx]]
                : activeEpisode.segments
              ).map((seg, mapIdx) => {
                const segIdx = eyesFreeMode ? activeSegmentIdx : mapIdx;
                const styleInfo = SPEAKER_BADGES[seg.speaker];
                const isCurrent = segIdx === activeSegmentIdx;
                return (
                  <button
                    key={`${activeEpisode.id}-${segIdx}`}
                    type="button"
                    onClick={() => speakSegment(activeEpisode, segIdx)}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: isCurrent
                        ? `1px solid ${styleInfo.accent}`
                        : "1px solid rgba(148, 163, 184, 0.2)",
                      background: isCurrent
                        ? styleInfo.bg
                        : "rgba(15, 23, 42, 0.45)",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          color: styleInfo.accent,
                          textTransform: "uppercase",
                        }}
                      >
                        {styleInfo.badge} · {seg.label}
                      </span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {isCurrent && playbackStatus === "playing" ? "🔊 Speaking" : "▶ Jump here"}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        lineHeight: 1.65,
                        color: "#f1f5f9",
                      }}
                    >
                      {seg.text}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Technical Comparison Table & Code Breakdown */}
          {!eyesFreeMode && (
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-normal)",
                borderRadius: "16px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>
                  Real-Life Story vs. Technical Concept Comparison
                </h3>
                <button
                  type="button"
                  onClick={handleReadTechSummaryAloud}
                  className="button button-quiet button-small"
                  style={{ borderColor: "#34d399", color: "#34d399" }}
                >
                  🔊 Listen to Tech Summary &amp; Rules
                </button>
              </div>

              <div style={{ overflowX: "auto", marginBottom: "18px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13.5px",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-normal)", textAlign: "left" }}>
                      <th style={{ padding: "10px", color: "#fdba74" }}>In the Story</th>
                      <th style={{ padding: "10px", color: "#38bdf8" }}>In Programming / DSA</th>
                      <th style={{ padding: "10px", color: "#34d399" }}>Why It Matters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeEpisode.comparisonRows.map((row) => (
                      <tr
                        key={row.storyElement}
                        style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.14)" }}
                      >
                        <td style={{ padding: "10px", color: "#f8fafc", fontWeight: 600 }}>
                          {row.storyElement}
                        </td>
                        <td style={{ padding: "10px", color: "#93c5fd", fontWeight: 700 }}>
                          {row.technicalConcept}
                        </td>
                        <td style={{ padding: "10px", color: "#cbd5e1" }}>
                          {row.whyItMatches}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <b style={{ fontSize: "14px", color: "#34d399" }}>
                    Small Technical Explanation &amp; Blueprint
                  </b>
                  <span
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: "#fbbf24",
                      background: "rgba(251, 191, 36, 0.12)",
                      padding: "2px 8px",
                      borderRadius: "99px",
                    }}
                  >
                    {activeEpisode.miniSnippet.complexity}
                  </span>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: "13.5px", color: "#e2e8f0", lineHeight: 1.6 }}>
                  {activeEpisode.technicalExplanation}
                </p>
                <pre
                  style={{
                    margin: 0,
                    padding: "12px",
                    borderRadius: "8px",
                    background: "#020617",
                    color: "#e2e8f0",
                    fontSize: "12.5px",
                    overflowX: "auto",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  {activeEpisode.miniSnippet.code}
                </pre>

                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>
                    Unlocks Interview Questions:
                  </span>
                  {activeEpisode.mappedProblems.map((prob) => (
                    <Link
                      key={prob}
                      href="/dsa"
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: "#38bdf8",
                        background: "rgba(56, 189, 248, 0.12)",
                        border: "1px solid rgba(56, 189, 248, 0.25)",
                        padding: "3px 9px",
                        borderRadius: "99px",
                        textDecoration: "none",
                      }}
                    >
                      {prob} ↗
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Interactive Episode Story Quiz & Mastery Submission */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(251, 146, 60, 0.35)",
              borderRadius: "16px",
              padding: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>
                🎯 Episode {activeEpisode.episodeNumber} Story Challenge
              </h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleReadQuizAloud}
                  className="button button-quiet button-small"
                  style={{ borderColor: "#f97316", color: "#fdba74" }}
                >
                  🔊 Read Question Aloud
                </button>
                <button
                  type="button"
                  onClick={() => setShowHint((h) => !h)}
                  className="button button-quiet button-small"
                >
                  {showHint ? "Hide Story Hint" : "💡 Story Hint"}
                </button>
              </div>
            </div>

            <p style={{ margin: "0 0 12px", fontSize: "14.5px", color: "#f8fafc", lineHeight: 1.6 }}>
              {activeEpisode.quiz.prompt}
            </p>

            {showHint && (
              <div
                style={{
                  background: "rgba(251, 191, 36, 0.12)",
                  border: "1px solid rgba(251, 191, 36, 0.35)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  color: "#fde68a",
                  marginBottom: "14px",
                }}
              >
                <b>Hint:</b> {activeEpisode.quiz.scenarioHint}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
              {activeEpisode.quiz.options.map((option, idx) => {
                const labels = ["A", "B", "C", "D"];
                const isSelected = selectedOption === idx;
                const isVerifiedCorrect =
                  quizFeedback && quizFeedback.correctIndex === idx;
                const isVerifiedWrongChoice =
                  quizFeedback &&
                  !quizFeedback.passed &&
                  isSelected &&
                  quizFeedback.correctIndex !== idx;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSelectedOption(idx);
                      setSubmitError("");
                    }}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: isVerifiedCorrect
                        ? "1px solid #10b981"
                        : isVerifiedWrongChoice
                        ? "1px solid #ef4444"
                        : isSelected
                        ? "1px solid #f97316"
                        : "1px solid var(--border-normal)",
                      background: isVerifiedCorrect
                        ? "rgba(16, 185, 129, 0.14)"
                        : isVerifiedWrongChoice
                        ? "rgba(239, 68, 68, 0.14)"
                        : isSelected
                        ? "rgba(249, 115, 22, 0.14)"
                        : "rgba(15, 23, 42, 0.4)",
                      color: "#f8fafc",
                      fontSize: "13.5px",
                      cursor: "pointer",
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <strong style={{ color: "#fdba74", minWidth: "20px" }}>
                      {labels[idx]}.
                    </strong>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="audio-recall-input"
                style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#cbd5e1", marginBottom: "6px" }}
              >
                Optional Teach-Back Note: {activeEpisode.bonusRecallPrompt}
              </label>
              <textarea
                id="audio-recall-input"
                rows={2}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write a 1-line explanation in your own words to lock in long-term recall..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-normal)",
                  background: "rgba(15, 23, 42, 0.55)",
                  color: "#f8fafc",
                  fontSize: "13px",
                }}
              />
            </div>

            {submitError && (
              <div style={{ color: "#fca5a5", fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>
                {submitError}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={submitting}
                  className="button button-cn-primary"
                  style={{ background: "#ea580c", borderColor: "#ea580c", fontWeight: 800 }}
                >
                  {submitting ? "Checking Answer..." : "Check My Answer & Complete Episode ✓"}
                </button>
                {prevEpisode && (
                  <button
                    type="button"
                    onClick={() => selectEpisode(prevEpisode, false)}
                    className="button button-quiet"
                  >
                    ← Ep {String(prevEpisode.episodeNumber).padStart(2, "0")}
                  </button>
                )}
              </div>

              {nextEpisode && (
                <button
                  type="button"
                  onClick={() => selectEpisode(nextEpisode, autoAdvance)}
                  className="button button-quiet"
                  style={{ borderColor: "#34d399", color: "#34d399" }}
                >
                  Next: Ep {String(nextEpisode.episodeNumber).padStart(2, "0")} ({nextEpisode.title}) →
                </button>
              )}
            </div>

            {quizFeedback && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  borderRadius: "12px",
                  border: quizFeedback.passed
                    ? "1px solid rgba(16, 185, 129, 0.5)"
                    : "1px solid rgba(239, 68, 68, 0.5)",
                  background: quizFeedback.passed
                    ? "rgba(16, 185, 129, 0.12)"
                    : "rgba(239, 68, 68, 0.12)",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 800,
                    color: quizFeedback.passed ? "#34d399" : "#fca5a5",
                    marginBottom: "6px",
                  }}
                >
                  {quizFeedback.passed
                    ? `✓ Episode ${quizFeedback.episodeNumber} Mastered!${quizFeedback.persisted ? " (Saved to SQLite Profile)" : ""}`
                    : "✗ Not quite — review the story punchline and try again!"}
                </div>
                <p style={{ margin: "0 0 8px", fontSize: "13.5px", color: "#f8fafc", lineHeight: 1.55 }}>
                  {quizFeedback.feedback}
                </p>
                {quizFeedback.recallFeedback?.note && (
                  <p style={{ margin: "0 0 8px", fontSize: "12.5px", color: "#93c5fd" }}>
                    <b>Teach-Back Check:</b> {quizFeedback.recallFeedback.note}
                  </p>
                )}
                {quizFeedback.passed && nextEpisode && (
                  <button
                    type="button"
                    onClick={() => selectEpisode(nextEpisode, true)}
                    className="button button-cn-primary button-small"
                    style={{ marginTop: "4px", background: "#10b981", borderColor: "#10b981" }}
                  >
                    Listen to Next Episode (Ep {String(nextEpisode.episodeNumber).padStart(2, "0")}) →
                  </button>
                )}
                {!quizFeedback.persisted && !signedIn && (
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#cbd5e1" }}>
                    <Link href="/login" style={{ color: "#fdba74", fontWeight: 700 }}>
                      Sign in cleanly
                    </Link>{" "}
                    to persist all {AUDIO_DSA_EPISODES.length} episode completions across sessions.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
