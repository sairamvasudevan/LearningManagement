export type ReadingSection = {
  kicker: string;
  title: string;
  content: string[];
  callout?: {
    type: "warning" | "tip" | "rule";
    title: string;
    text: string;
  };
};

export type CaseStudy = {
  tag: string;
  title: string;
  problem: string;
  flawedApproach: string;
  correctInvariant: string;
  codeOrContract?: string;
};

export type PracticeTask = {
  id: string;
  title: string;
  scenario: string;
  prompt: string;
  starterTemplate: string;
  modelSolution: string;
  rubric: string[];
};

export type ModuleQuestion = {
  question_id: string;
  sort_order: number;
  title: string;
  prompt: string;
  options: string[];
  hints: string[];
  marks: number;
  correct_index: number;
  explanation: string;
  option_explanations: string[];
};

export type ModuleCurriculum = {
  moduleNumber: number;
  stageNumber: number;
  stageTitle: string;
  title: string;
  objective: string;
  readTime: string;
  coreFocus: string;
  sections: ReadingSection[];
  caseStudies: CaseStudy[];
  checklist: string[];
  practiceTask: PracticeTask;
  questions: ModuleQuestion[];
};

export type Review = {
  is_correct: boolean;
  selected_index: number;
  correct_index: number;
  marks_awarded: number;
  max_marks: number;
  explanation: string;
  option_explanations: string[];
};
