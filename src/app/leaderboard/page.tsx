'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { WeeklyLeaderboard } from '@/lib/types';
import { Heading, Subheading } from '@/components/heading';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Listbox, ListboxOption } from '@/components/listbox';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/table';
import { ArrowLeftIcon } from '@heroicons/react/24/solid'

export default function LeaderboardPage() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedClass, setSelectedClass] = useState('all');
  const [leaderboards, setLeaderboards] = useState<WeeklyLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch leaderboard data from Supabase
  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        setLoading(true);
        
        // Get all submissions grouped by week
        const { data: submissions, error: submissionsError } = await supabase
          .from('submissions')
          .select('week_number, total_points, student_id, students:student_id(name, class)')
          .order('total_points', { ascending: false });
        
        if (submissionsError) throw submissionsError;
        
        // Process submissions into weekly leaderboards
        const weeklyData: Record<number, WeeklyLeaderboard> = {};
        
        submissions?.forEach(submission => {
          const weekNum = submission.week_number;
          // Replace any with a more specific type
          const student = submission.students as { name?: string; class?: string };
          
          if (!weeklyData[weekNum]) {
            weeklyData[weekNum] = {
              week_number: weekNum,
              rankings: []
            };
          }
          
          weeklyData[weekNum].rankings.push({
            student_id: submission.student_id,
            student_name: student?.name || 'Anonymous',
            points: submission.total_points,
            class: student?.class || 'Unknown'
          });
        });
        
        // Convert to array and sort by week number
        const leaderboardArray = Object.values(weeklyData).sort((a, b) => a.week_number - b.week_number);
        setLeaderboards(leaderboardArray);
        
        // If no data, create an empty leaderboard for week 1
        if (leaderboardArray.length === 0) {
          setLeaderboards([{
            week_number: 1,
            rankings: []
          }]);
        }
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaderboardData();
  }, []);
  
  // Get the leaderboard for the selected week
  const currentLeaderboard = leaderboards.find(lb => lb.week_number === selectedWeek) || leaderboards[0] || { week_number: 1, rankings: [] };
  
  // Filter rankings by class if a specific class is selected
  const filteredRankings = selectedClass === 'all'
    ? currentLeaderboard.rankings
    : currentLeaderboard.rankings.filter(r => r.class === selectedClass);

  return (
    <div className="min-h-screen py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Button  plain href='/'>
            <ArrowLeftIcon/> Back to Home
          </Button>
          <Button  plain href='/submit/'>
            Submit New Entry
          </Button>
        </div>

        <div className="p-8">
          <Heading level={1} className="mb-2 text-center">Energy Challenge Leaderboard</Heading>
          <Text className="mb-8 text-center">See who&apos;s leading in energy conservation!</Text>

          <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <label className="block mb-2" htmlFor="week">
                Select Week
              </label>
              <Listbox
                value={selectedWeek.toString()}
                onChange={(value) => setSelectedWeek(Number(value))}
              >
                {leaderboards.map(lb => (
                  <ListboxOption key={lb.week_number} value={lb.week_number.toString()}>
                    Week {lb.week_number}
                  </ListboxOption>
                ))}
              </Listbox>
            </div>

            <div>
              <label className="block mb-2" htmlFor="class">
                Filter by Class
              </label>
              <Listbox
                value={selectedClass}
                onChange={setSelectedClass}
              >
                <ListboxOption value="all">All Classes</ListboxOption>
                <ListboxOption value="TTO2">TTO2</ListboxOption>
                <ListboxOption value="TTO3">TTO3</ListboxOption>
              </Listbox>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table grid>
              <TableHead>
                <TableRow>
                  <TableHeader>Rank</TableHeader>
                  <TableHeader>Student</TableHeader>
                  <TableHeader>Class</TableHeader>
                  <TableHeader className="text-right">Points</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRankings.map((ranking, index) => (
                  <TableRow 
                    key={ranking.student_id} 
                  >
                    <TableCell>
                      {index === 0 && (
                        <span className="inline-block w-6 h-6 text-center">1</span>
                      )}
                      {index === 1 && (
                        <span className="inline-block w-6 h-6 text-center">2</span>
                      )}
                      {index === 2 && (
                        <span className="inline-block w-6 h-6 text-center">3</span>
                      )}
                      {index > 2 && (
                        <span>{index + 1}</span>
                      )}
                    </TableCell>
                    <TableCell>{ranking.student_name}</TableCell>
                    <TableCell>{ranking.class}</TableCell>
                    <TableCell className="text-right">{ranking.points}</TableCell>
                  </TableRow>
                ))}
                {filteredRankings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No data available for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 p-4 rounded-lg">
            <Subheading level={3} className="mb-2">How Points are Calculated</Subheading>
            <Text>
              Points are awarded based on your energy-saving actions. The more energy-conscious choices you make, 
              the more points you earn. Complete the weekly submission form to add your points to the leaderboard!
            </Text>
          </div>
        </div>

        <div className="mt-8 text-center">
          {loading && <Text>Loading leaderboard data...</Text>}
          {error && <Text className="text-red-500">{error}</Text>}
          <Text>Updated weekly. Last update: {new Date().toLocaleDateString()}</Text>
        </div>
      </div>
    </div>
  );
}