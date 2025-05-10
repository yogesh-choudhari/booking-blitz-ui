
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Sample user profiles
  const sampleUsers = [
    { username: 'kunal', displayName: 'Kunal Sharma' },
    { username: 'sarah', displayName: 'Sarah Johnson' },
    { username: 'miguel', displayName: 'Miguel Rodriguez' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Calendly-Style Scheduler</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto max-w-7xl px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-center mb-8">
                Welcome to our Scheduling Demo
              </h2>
              
              <p className="text-gray-600 text-center mb-8">
                This is a demonstration of our Calendly-style scheduling system. 
                Select a demo user below to view their booking page.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sample Profiles:</h3>
                
                <div className="grid gap-4 md:grid-cols-3">
                  {sampleUsers.map(user => (
                    <Link 
                      key={user.username} 
                      to={`/${user.username}`} 
                      className="block"
                    >
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="font-medium">{user.displayName}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <h3 className="text-lg font-medium mb-4">
                  Try it directly:
                </h3>
                <Button asChild className="text-white bg-blue-500 hover:bg-blue-600">
                  <Link to="/kunal">View Kunal's Calendar</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto max-w-7xl px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Calendly-Style Scheduler Demo
        </div>
      </footer>
    </div>
  );
};

export default Index;
