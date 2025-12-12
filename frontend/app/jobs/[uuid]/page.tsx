'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { jobsAPI, Job, JobMaterial, Note } from '@/lib/api';

export default function JobDetailsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const uuid = params.uuid as string;

  const [job, setJob] = useState<Job | null>(null);
  const [materials, setMaterials] = useState<JobMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    if (user && uuid) {
      fetchJobDetails();
      fetchNotes();
    }
  }, [user, uuid]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobDetails(uuid);
      setJob(response.job);
      setMaterials(response.materials);
    } catch (error: any) {
      setError(error.message || 'Failed to load job details');
      console.error('Failed to fetch job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      setNotesLoading(true);
      setNotesError('');
      const response = await jobsAPI.listNotes(uuid);
      setNotes(response.notes);
    } catch (error: any) {
      setNotesError(error.message || 'Failed to load notes');
      console.error('Failed to fetch notes:', error);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteInput.trim()) {
      return;
    }

    try {
      setSubmittingNote(true);
      await jobsAPI.createNote(uuid, noteInput);
      setNoteInput('');
      await fetchNotes();
    } catch (error: any) {
      setNotesError(error.message || 'Failed to add note');
      console.error('Failed to add note:', error);
    } finally {
      setSubmittingNote(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'quote':
        return 'bg-blue-100 text-blue-800';
      case 'work order':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = () => {
    return materials.reduce((sum, material) => {
      const price = parseFloat(material.price || material.displayed_amount || '0');
      const quantity = material.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
          <Card className="h-48">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button variant="outline" onClick={() => router.push('/jobs')}>
            ← Back to Orders
          </Button>
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <div className="text-5xl">❌</div>
                <h3 className="text-xl font-semibold text-gray-900">Failed to load job</h3>
                <p className="text-gray-600">{error || 'Job not found'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => router.push('/jobs')}>
            ← Back to Orders
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  Order #{job.uuid.substring(0, 8).toUpperCase()}
                </CardTitle>
                <CardDescription className="mt-2">
                  Created on {formatDate(job.created_date || job.edit_date)}
                </CardDescription>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(job.status)}`}>
                {job.status || 'Unknown'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Job ID</p>
                <p className="font-medium font-mono text-sm">{job.uuid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="font-medium">{job.status || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium">{formatDate(job.edit_date)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Materials</CardTitle>
            <CardDescription>Items included in this order</CardDescription>
          </CardHeader>
          <CardContent>
            {materials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No materials found for this job
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {materials.map((material) => {
                        const price = parseFloat(material.price || material.displayed_amount || '0');
                        const quantity = material.quantity || 1;
                        const total = price * quantity;

                        return (
                          <tr key={material.uuid} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium">{material.material_uuid}</p>
                                <p className="text-sm text-gray-500 font-mono text-xs">{material.uuid.substring(0, 13)}...</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right font-medium">{quantity}</td>
                            <td className="px-4 py-4 text-right font-medium">${price.toFixed(2)}</td>
                            <td className="px-4 py-4 text-right font-bold">${total.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-4 text-right font-semibold">Total:</td>
                        <td className="px-4 py-4 text-right font-bold text-lg text-blue-600">
                          ${calculateTotal().toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Add notes or comments about this order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notesError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {notesError}
              </div>
            )}

            <div className="space-y-3">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add a note..."
                className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                disabled={submittingNote}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddNote}
                  disabled={submittingNote || !noteInput.trim()}
                >
                  {submittingNote ? 'Adding...' : 'Add Note'}
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              {notesLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                    </div>
                  ))}
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No notes yet. Be the first to add one!
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.uuid} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-gray-500">
                          {formatDate(note.created_date || note.edit_date)}
                        </p>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">{note.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}