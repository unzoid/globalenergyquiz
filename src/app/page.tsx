import Link from 'next/link';
import Image from 'next/image';
import { Heading, Subheading } from '@/components/heading';
import { Text } from '@/components/text';
import { Button } from '@/components/button';

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <Heading level={1} className="mb-4">Grotius Energy Challenge</Heading>
          <Text className="max-w-3xl mx-auto">
            Join the 4-week challenge to reduce energy consumption and compete with your classmates!
          </Text>
        </header>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="p-8 flex flex-col items-center text-center">
            <div className="p-4 mb-6">
              <Image 
                src="/globe.svg" 
                alt="Challenge" 
                width={60} 
                height={60} 
              />
            </div>
            <Heading level={2} className="mb-4">Take the Challenge</Heading>
            <Text className="mb-6">
              Answer weekly questions about your energy-saving habits and earn points for sustainable actions.
            </Text>
            <Button>
              <Link href="/submit">Start Now</Link>
            </Button>
          </div>

          <div className="p-8 flex flex-col items-center text-center">
            <div className="p-4 mb-6">
              <Image 
                src="/file.svg" 
                alt="Leaderboard" 
                width={60} 
                height={60} 
              />
            </div>
            <Heading level={2} className="mb-4">View Leaderboard</Heading>
            <Text className="mb-6">
              See how you rank against other TTO students and track your progress throughout the challenge.
            </Text>
            <Button>
              <Link href="/leaderboard">Check Rankings</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 p-8 max-w-5xl mx-auto">
          <Heading level={2} className="mb-4 text-center">How It Works</Heading>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span>1</span>
              </div>
              <Subheading level={3} className="mb-2">Submit Weekly</Subheading>
              <Text>Answer 10 questions about your energy-saving habits each week</Text>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span>2</span>
              </div>
              <Subheading level={3} className="mb-2">Earn Points</Subheading>
              <Text>Get points for each energy-saving action you take</Text>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span>3</span>
              </div>
              <Subheading level={3} className="mb-2">Compete & Win</Subheading>
              <Text>See your ranking and compete with other TTO students</Text>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center">
          <Text>© {new Date().getFullYear()} Energy Challenge | TTO2 & TTO3</Text>
        </footer>
      </div>
    </div>
  );
}
