'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { questions } from '@/lib/questions';
import { QuestionAnswer } from '@/lib/types';
import supabase from '@/lib/supabase';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Listbox, ListboxOption } from '@/components/listbox';
import { Checkbox } from '@/components/checkbox';
import { ArrowLeftIcon } from '@heroicons/react/24/solid'

export default function SubmitPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentClass, setStudentClass] = useState('TTO2');
  const [weekNumber, setWeekNumber] = useState(1);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Initialize answers with empty valuess
  useEffect(() => {
    const initialAnswers = questions.map(q => ({
      question_id: q.id,
      answer: q.type === 'input' ? 0 : '',
      points: 0
    }));
    setAnswers(initialAnswers);
  }, []);

  const handleInputChange = (question_id: number, value: string | number) => {
    const question = questions.find(q => q.id === question_id);
    if (!question) return;

    let points = 0;
    if (question.type === 'input' && question.pointsPerUnit) {
      points = Number(value) * question.pointsPerUnit;
    } else if (question.type === 'multiple-choice' && question.pointsPerOption) {
      points = question.pointsPerOption[value as string] || 0;
    }

    setAnswers(prev => 
      prev.map(a => 
        a.question_id === question_id 
          ? { ...a, answer: value, points } 
          : a
      )
    );
  };

  const calculateTotalPoints = () => {
    return answers.reduce((sum, answer) => sum + answer.points, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create a new student if they don't exist
      const displayName = isAnonymous ? 'Anonymous' : studentName;
      const student_id = `${displayName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      
      console.log('Creating/updating student record with ID:', student_id);
      
      // First create or update the student record
      const { error: studentError, data: studentData } = await supabase
        .from('students')
        .upsert({
          id: student_id,
          name: displayName,
          email: studentEmail,
          class: studentClass,
          points: 0, // Start with 0, we'll update after submission
          created_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (studentError) {
        console.error('Supabase student error:', studentError);
        throw new Error(`Student creation error: ${studentError.message}`);
      }
      
      console.log('Student record created/updated successfully:', studentData);
      
      // After student is created, then create the submission
      const submission = {
        id: `${student_id}-week${weekNumber}`,
        student_id: student_id,
        week_number: weekNumber,
        answers,
        total_points: calculateTotalPoints(),
        created_at: new Date().toISOString(),
        is_anonymous: isAnonymous
      };

      console.log('Creating submission:', submission);

      // Now that the student exists, save the submission to Supabase
      const { error: submissionError, data: submissionData } = await supabase
        .from('submissions')
        .insert(submission);

      if (submissionError) {
        console.error('Supabase submission error:', submissionError);
        throw new Error(`Submission error: ${submissionError.message}`);
      }

      console.log('Submission saved successfully:', submissionData);
      
      // Update the student's total points after successful submission
      const { data: existingStudent, error: existingStudentError } = await supabase
        .from('students')
        .select('points')
        .eq('id', student_id)
        .single();
        
      if (existingStudentError) {
        console.error('Error checking existing student points:', existingStudentError);
        // Not throwing here, as the submission was already successful
      } else {
        // Update total points (only if we got the current points successfully)
        const currentPoints = existingStudent?.points || 0;
        const newPoints = currentPoints + calculateTotalPoints();
        console.log(`Updating student points from ${currentPoints} to ${newPoints}`);
        
        const { error: pointsUpdateError } = await supabase
          .from('students')
          .update({ points: newPoints })
          .eq('id', student_id);
          
        if (pointsUpdateError) {
          console.error('Error updating student points:', pointsUpdateError);
          // Not throwing here since the core submission worked
        } else {
          console.log('Student points updated successfully to:', newPoints);
        }
      }
      
      setSubmitSuccess(true);
      
      // Redirect to leaderboard after successful submission
      setTimeout(() => {
        router.push('/leaderboard');
      }, 2000);
    } catch (err) {
      console.error('Error submitting:', err);
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      setError(`Failed to submit your answers: ${errorMessage}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full mx-auto bg-green-900 border border-green-400 rounded-lg shadow-lg p-8 text-center text-green-100"
        >
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
            className="mx-auto flex items-center justify-center w-12 h-12 bg-green-800 border border-green-400 rounded-full mb-4"
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-green-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
            >
              <motion.path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </motion.svg>
          </motion.div>
          <Heading level={1} className="text-2xl font-bold text-green-100 mb-2">Submission Successful!</Heading>
          <Text className="mb-4 text-green-200">Thank you for participating in the Energy Challenge!</Text>
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-green-800 rounded-md p-4 mb-6 shadow-inner border border-green-700"
          >
            <Text className="text-lg font-medium text-green-100">You earned <span className="text-green-300 font-bold">{calculateTotalPoints()}</span> points this week.</Text>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button color="green" href="/leaderboard/">View Leaderboard</Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
        <Button plain href='/'>
            <ArrowLeftIcon/> Back to Home
          </Button>
          <Button plain href='/leaderboard/'>
            View Leaderboard
          </Button>
        </div>

        <div className="p-8">
          <Heading level={1} className="mb-2">Energy Challenge Submission</Heading>
          <Text className="mb-8">Week {weekNumber}</Text>

          {error && (
            <div className="px-4 py-3 rounded mb-6 bg-red-100 border border-red-400 text-red-700">
              <Text className="font-medium">Error: {error}</Text>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-8 grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2" htmlFor="name">
                  Your Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2" htmlFor="email">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2" htmlFor="class">
                  Class
                </label>
                <Listbox
                  name="class"
                  value={studentClass}
                  onChange={setStudentClass}
                >
                  <ListboxOption value="TTO2">TTO2</ListboxOption>
                  <ListboxOption value="TTO3">TTO3</ListboxOption>
                </Listbox>
              </div>
              <div>
                <label className="block mb-2" htmlFor="week">
                  Week Number
                </label>
                <Listbox
                  name="week"
                  value={weekNumber.toString()}
                  onChange={(value) => setWeekNumber(Number(value))}
                >
                  <ListboxOption value="1">Week 1</ListboxOption>
                  <ListboxOption value="2">Week 2</ListboxOption>
                  <ListboxOption value="3">Week 3</ListboxOption>
                  <ListboxOption value="4">Week 4</ListboxOption>
                </Listbox>
              </div>
              <div className="flex items-center col-span-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(checked) => setIsAnonymous(checked)}
                  color="blue"
                />
                <label className="ml-2" htmlFor="anonymous">
                  Submit anonymously (your name won&apos;t appear on the leaderboard)
                </label>
              </div>
            </div>

            <div className="mb-8 space-y-8">
              <Heading level={2} className="mb-6">Weekly Questions</Heading>
              
              {questions.map(question => (
                <div key={question.id} className="p-4 rounded-lg">
                  <Text className="mb-3">{question.text}</Text>
                  
                  {question.type === 'input' ? (
                    <div>
                      <Input
                        type="number"
                        min="0"
                        value={answers.find(a => a.question_id === question.id)?.answer.toString() || '0'}
                        onChange={(e) => handleInputChange(question.id, parseInt(e.target.value) || 0)}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Listbox
                        value={answers.find(a => a.question_id === question.id)?.answer.toString() || ''}
                        onChange={(value) => handleInputChange(question.id, value)}
                      >
                        {question.options?.map(option => (
                          <ListboxOption key={option} value={option}>
                            {option}
                          </ListboxOption>
                        ))}
                      </Listbox>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Your Answers'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}