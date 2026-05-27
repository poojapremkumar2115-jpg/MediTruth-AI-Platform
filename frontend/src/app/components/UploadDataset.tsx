import React, { useState } from 'react';

interface UploadResponse {
  total_scans: number;
  real_count: number;
  fake_count: number;
  avg_confidence: number;
  results: Array<{
    text: string;
    prediction: string;
    confidence: number;
    risk_level: number;
    explanation: string;
    suggested_label: number;
  }>;
}

const UploadDataset: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file to upload.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-dataset', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Upload failed');
      }
      const data: UploadResponse = await res.json();
      setResponse(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Upload Dataset (CSV)</h2>
      <p className="text-gray-300 mb-4">
        Upload a CSV file containing medical news claims. The backend will run each claim through the model and return aggregated statistics.
      </p>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 transition"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-full hover:opacity-90 transition"
      >
        {loading ? 'Uploading...' : 'Upload & Scan'}
      </button>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {response && (
        <div className="mt-6 text-gray-200">
          <h3 className="text-xl font-semibold mb-2">Upload Summary</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Total Scans: {response.total_scans}</li>
            <li>Real Claims: {response.real_count}</li>
            <li>Fake Claims: {response.fake_count}</li>
            <li>Average Confidence: {response.avg_confidence}%</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadDataset;
