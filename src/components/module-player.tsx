"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Question = { question_id:string; sort_order:number; title:string; prompt:string; options:string[]; hints:string[]; marks:number };
type Review = { is_correct:boolean; selected_index:number; correct_index:number; marks_awarded:number; max_marks:number; explanation:string; option_explanations:string[]; already_submitted?:boolean };
type SavedResponse = { question_id:string; selected_index:number; is_correct:boolean; marks_awarded:number };

export function ModulePlayer({ moduleNumber, title, objective, questions }: {
  moduleNumber:number; title:string; objective:string; questions:Question[];
}) {
  const [mode,setMode]=useState<"content"|"assessment"|"result">("content");
  const [attemptId,setAttemptId]=useState<string|null>(null);
  const [index,setIndex]=useState(0);
  const [selected,setSelected]=useState<Record<string,number>>({});
  const [reviews,setReviews]=useState<Record<string,Review>>({});
  const [hintOpen,setHintOpen]=useState<Record<string,number[]>>({});
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [result,setResult]=useState<{score:number;total_marks:number;pass_percent:number;passed:boolean}|null>(null);
  const supabase=useMemo(()=>createClient(),[]);
  const question=questions[index];
  const currentReview=question ? reviews[question.question_id] : undefined;
  const score=Object.values(reviews).reduce((n,r)=>n+r.marks_awarded,0);
  const total=questions.reduce((n,q)=>n+q.marks,0);

  const beginAssessment = useCallback(async ()=>{
    if(!questions.length){setError('The assessment questions have not been published yet.');return;}
    setBusy(true);setError('');
    try{
      const {data,error:rpcError}=await supabase.rpc('start_module_assessment',{p_module_number:moduleNumber});
      if(rpcError)throw rpcError;
      const id=String(data);setAttemptId(id);
      const {data:saved,error:savedError}=await supabase.from('assessment_responses').select('question_id,selected_index,is_correct,marks_awarded').eq('attempt_id',id);
      if(savedError)throw savedError;
      const restored:Record<string,Review>={};const choices:Record<string,number>={};
      for(const row of (saved||[]) as SavedResponse[]){
        choices[row.question_id]=row.selected_index;
        const {data:review,error:reviewError}=await supabase.rpc('submit_assessment_answer',{
          p_attempt_id:id,p_question_id:row.question_id,p_selected_index:row.selected_index,
        });
        if(reviewError) throw reviewError;
        restored[row.question_id]=review as Review;
      }
      setSelected(choices);setReviews(restored);
      const firstUnanswered=questions.findIndex(q=>choices[q.question_id]===undefined);
      setIndex(firstUnanswered<0?questions.length-1:firstUnanswered);
      setMode('assessment');
    }catch(e){setError(e instanceof Error?e.message:'Could not start the assessment.');}
    finally{setBusy(false);}
  },[moduleNumber,questions,supabase]);

  useEffect(()=>{
    function onMessage(event:MessageEvent){
      if(event.origin!==window.location.origin || event.source===window) return;
      const data=event.data as {type?:string;moduleNumber?:number;activityId?:string;response?:string};
      if(data?.moduleNumber!==moduleNumber) return;
      if(data.type==='PSL_OPEN_ASSESSMENT'){
        void beginAssessment();
        return;
      }
      if(data.type==='PSL_ACTIVITY_SAVED' && moduleNumber===1 && typeof data.activityId==='string' && typeof data.response==='string'){
        const source=event.source as WindowProxy | null;
        const activityId=data.activityId;
        const response=data.response;
        const origin=event.origin;
        void (async ()=>{
          try{
            const {error:saveError}=await supabase.rpc('save_lesson_activity',{
              p_module_number:moduleNumber,
              p_activity_id:activityId,
              p_response:response,
            });
            source?.postMessage({
              type:'PSL_ACTIVITY_SAVED_RESULT',
              moduleNumber,
              activityId,
              ok:!saveError,
              message:saveError?'Could not save to your account. Please retry.':'Saved to your student account.',
            },origin);
          }catch{
            source?.postMessage({
              type:'PSL_ACTIVITY_SAVED_RESULT',
              moduleNumber,
              activityId,
              ok:false,
              message:'Connection problem. Please retry saving your response.',
            },origin);
          }
        })();
      }
    }
    window.addEventListener('message',onMessage);
    return ()=>window.removeEventListener('message',onMessage);
  },[beginAssessment,moduleNumber,supabase]);

  async function submitAnswer(){
    if(!question || selected[question.question_id]===undefined || !attemptId || currentReview)return;
    setBusy(true);setError('');
    try{
      const {data,error:rpcError}=await supabase.rpc('submit_assessment_answer',{
        p_attempt_id:attemptId,p_question_id:question.question_id,p_selected_index:selected[question.question_id],
      });
      if(rpcError)throw rpcError;
      const review=data as Review;
      setReviews(current=>({...current,[question.question_id]:review}));
    }catch(e){setError(e instanceof Error?e.message:'The answer could not be submitted.');}
    finally{setBusy(false);}
  }

  async function finishAssessment(){
    if(!attemptId || Object.keys(reviews).length!==questions.length)return;
    setBusy(true);setError('');
    try{
      const {data,error:rpcError}=await supabase.rpc('finalize_module_assessment',{p_attempt_id:attemptId});
      if(rpcError)throw rpcError;
      setResult(data as {score:number;total_marks:number;pass_percent:number;passed:boolean});setMode('result');
    }catch(e){setError(e instanceof Error?e.message:'Could not finalize the assessment.');}
    finally{setBusy(false);}
  }

  function toggleHint(hintIndex:number){if(!question)return;setHintOpen(current=>{const old=current[question.question_id]||[];return {...current,[question.question_id]:old.includes(hintIndex)?old.filter(x=>x!==hintIndex):[...old,hintIndex]};});}

  if(mode==='content') return <div className="module-player-shell">
    <div className="learn-heading"><div><span className="eyebrow">PATH 01 · MODULE {String(moduleNumber).padStart(2,'0')}</span><h1>{title}</h1><p>{objective}</p></div><Link href="/portal" className="button button-quiet">← Dashboard</Link></div>
    <div className="lesson-frame-wrap"><iframe title={`Learning content: ${title}`} src="/course-content#lesson/1" className="lesson-frame" /></div>
    <div className="lesson-player-note"><div><b>Lesson learning content</b><p>Complete the lesson material above. Its “Start mastery checkpoint” action will open the secure, database-graded assessment here.</p></div><button className="button button-primary" onClick={()=>void beginAssessment()} disabled={busy}>{busy?'Starting…':'Start mastery checkpoint →'}</button></div>
    {error&&<div className="form-alert">{error}</div>}
  </div>;

  if(mode==='result' && result) return <div className="result-screen">
    <span className="eyebrow">MODULE {String(moduleNumber).padStart(2,'0')} · RESULT</span>
    <div className={`result-orb ${result.passed?'success':'failure'}`}>{result.score}<small> / {result.total_marks}</small></div>
    <h1>{result.passed?'Mastery checkpoint passed':'Checkpoint not passed yet'}</h1>
    <p>You scored {Math.round(result.score/result.total_marks*100)}%. The required score is {result.pass_percent}%.</p>
    <div className="result-actions"><Link className="button button-primary" href="/portal">Return to student dashboard</Link><button className="button button-quiet" onClick={()=>{setMode('content');setResult(null);setReviews({});setSelected({});setAttemptId(null);}}>Review lesson</button></div>
  </div>;

  if(!question) return <div className="surface-card"><p>No assessment questions are published for this lesson yet.</p><Link href="/portal">Return to dashboard</Link></div>;

  return <div className="assessment-shell">
    <div className="assessment-top"><div><span className="eyebrow">PROBLEM SOLVING LAB · MODULE {String(moduleNumber).padStart(2,'0')}</span><b>{title}</b></div><div className="assessment-score">Score <strong>{score}/{total}</strong></div></div>
    <div className="assessment-progress"><span style={{width:`${((index+1)/questions.length)*100}%`}} /></div>
    <div className="assessment-meta"><span>Question {index+1} of {questions.length}</span><span className="mark-chip">{question.marks} marks</span></div>
    <section className="question-card">
      <div className="question-label">Read the scenario · reason before selecting</div>
      <h1>{question.prompt}</h1>
      <div className="option-list">{question.options.map((option,i)=>{
        const chosen=selected[question.question_id]===i;const correct=currentReview?.correct_index===i;const wrong=currentReview?.selected_index===i&&!currentReview.is_correct;
        return <button key={i} className={`option-button ${chosen?'selected':''} ${correct?'option-correct':''} ${wrong?'option-wrong':''}`} disabled={Boolean(currentReview)} onClick={()=>setSelected(current=>({...current,[question.question_id]:i}))}>
          <span className="option-letter">{String.fromCharCode(65+i)}</span><span>{option}</span><span className="option-indicator">{correct?'✓':wrong?'×':chosen?'●':''}</span>
        </button>;
      })}</div>
      <div className="hint-list">{question.hints.map((hint,i)=>{const open=(hintOpen[question.question_id]||[]).includes(i);return <div className="hint-item" key={i}><button onClick={()=>toggleHint(i)} className="hint-toggle">{open?'−':'+'} Hint {i+1}</button>{open&&<p>{hint}</p>}</div>;})}</div>
      {currentReview&&<div className={`answer-explanation ${currentReview.is_correct?'answer-good':'answer-review'}`}>
        <div className="answer-heading"><b>{currentReview.is_correct?'Correct answer':'Review the correct answer'}</b><span>{currentReview.marks_awarded}/{currentReview.max_marks} marks awarded</span></div>
        <p><b>Your answer:</b> {question.options[currentReview.selected_index]}</p>
        <p><b>Correct answer:</b> {question.options[currentReview.correct_index]}</p>
        <p><b>Detailed explanation:</b> {currentReview.explanation}</p>
        <details><summary>Why each option is right or wrong</summary><ul>{currentReview.option_explanations.map((text,i)=><li key={i}><b>{String.fromCharCode(65+i)}.</b> {text}</li>)}</ul></details>
      </div>}
      <div className="submit-answer-row"><button className="button button-primary" onClick={()=>void submitAnswer()} disabled={busy||Boolean(currentReview)||selected[question.question_id]===undefined}>{busy?'Submitting…':currentReview?'Answer submitted':`Submit answer · ${question.marks} marks`}</button><span>{currentReview?'Your answer is saved to your account.': 'Choose an option, then submit to receive marks and the explanation.'}</span></div>
    </section>
    <div className="assessment-nav"><button className="button button-quiet" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>← Previous</button><div className="assessment-nav-note">{Object.keys(reviews).length} of {questions.length} answers submitted</div>{index<questions.length-1?<button className="button button-dark" disabled={!currentReview} onClick={()=>setIndex(i=>Math.min(questions.length-1,i+1))}>Next question →</button>:<button className="button button-primary" disabled={busy||Object.keys(reviews).length!==questions.length} onClick={()=>void finishAssessment()}>{busy?'Calculating…':'Finish assessment →'}</button>}</div>
    {error&&<div className="form-alert">{error}</div>}
  </div>;
}
