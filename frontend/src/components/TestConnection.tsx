import { useState } from 'react';
import { auth, books, genres } from '@/lib/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const TestConnection = () => {
  const [testResults, setTestResults] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: { [key: string]: string } = {};

    try {
      // Test 1: Login
      try {
        const loginResult = await auth.login('admin@library.com', 'admin123');
        results['Login'] = loginResult.access_token ? 'Success' : 'Failed';
        localStorage.setItem('token', loginResult.access_token);
      } catch (error: any) {
        results['Login'] = `Failed: ${error.response?.data?.detail || error.message}`;
      }

      // Test 2: Get Profile
      try {
        const profile = await auth.getProfile();
        results['Get Profile'] = profile.email ? 'Success' : 'Failed';
      } catch (error: any) {
        results['Get Profile'] = `Failed: ${error.response?.data?.detail || error.message}`;
      }

      // Test 3: Get Genres
      try {
        const genresList = await genres.getAll();
        results['Get Genres'] = Array.isArray(genresList) ? 'Success' : 'Failed';
      } catch (error: any) {
        results['Get Genres'] = `Failed: ${error.response?.data?.detail || error.message}`;
      }

      // Test 4: Get Books
      try {
        const booksList = await books.getAll();
        results['Get Books'] = Array.isArray(booksList) ? 'Success' : 'Failed';
      } catch (error: any) {
        results['Get Books'] = `Failed: ${error.response?.data?.detail || error.message}`;
      }

    } catch (error: any) {
      console.error('Test failed:', error);
    } finally {
      setTestResults(results);
      setLoading(false);
    }
  };

  return (
    <Card className="w-[600px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>Backend Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={loading}
        >
          {loading ? 'Running Tests...' : 'Run Integration Tests'}
        </Button>

        {Object.entries(testResults).map(([test, result]) => (
          <div 
            key={test} 
            className={`p-2 rounded ${
              result === 'Success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            <strong>{test}:</strong> {result}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TestConnection; 