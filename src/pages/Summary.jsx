import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setText, setSummary, setLoading, setError } from '../redux/summarySlice';
import { addToHistory } from '../redux/historySlice';
import { db, auth } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Summary() {
  const dispatch = useDispatch();
  const { text, summary, loading, error } = useSelector(state => state.summary);
  const user = useSelector(state => state.auth.user);

  const generateSummary = async () => {
    if (!text.trim()) {
      dispatch(setError('Please enter text to summarize'));
      return;
    }

    dispatch(setLoading(true));
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY );

      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `Please summarize the following text in a clear and concise manner:\n\n${text}\n\nProvide only the summary, without any additional commentary.`;
      
      const result = await model.generateContent(prompt);
      const summaryText = result.response.text();
      dispatch(setSummary(summaryText));
      if (auth.currentUser) {
        try {
         
          const docRef = await addDoc(collection(db, 'summaries'), {
            userId: auth.currentUser.uid,
            originalText: text,
            summary: summaryText,
            timestamp: serverTimestamp(),
          });
          
         
          dispatch(addToHistory({
            id: docRef.id,
            originalText: text,
            summary: summaryText,
            timestamp: new Date().toISOString(),
          }));
          console.log('Summary saved to Firebase:', docRef.id);
        } catch (firebaseErr) {
          console.error('Firebase write error:', firebaseErr);
          dispatch(setError('Failed to save summary to Firebase: ' + firebaseErr.message));
        }
      } else {
        console.warn('User not authenticated - summary not saved to Firebase');
      }
    } catch (err) {
      dispatch(setError(err.message || 'Failed to generate summary'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">AI Text Summarizer</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter Text to Summarize
            </label>
            <textarea
              value={text}
              onChange={(e) => dispatch(setText(e.target.value))}
              placeholder="Paste your text here..."
              rows="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
            <button
              onClick={generateSummary}
              disabled={loading}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Summary'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Summary Result
            </label>
            <div className="h-64 border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-y-auto">
              {summary ? (
                <p className="text-gray-800 leading-relaxed">{summary}</p>
              ) : (
                <p className="text-gray-400 text-center mt-24">Your summary will appear here...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
