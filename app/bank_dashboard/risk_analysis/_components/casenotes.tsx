'use client';
import React, { useState } from 'react';
import { MessageSquare, UserPlus, Flag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Note {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface CaseNotesProps {
  notes: Note[];
  onAddNote: (note: string) => void;
  onEscalate: () => void;
  onMarkSafe: () => void;
  onAssign: (userId: string) => void;
}

export function CaseNotes({
  notes,
  onAddNote,
  onEscalate,
  onMarkSafe,
  onAssign
}: CaseNotesProps) {
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote('');
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg">Case Notes & Actions</CardTitle>
        <MessageSquare className="h-5 w-5 text-blue-600" />
      </CardHeader>
      <CardContent>
        {/* Notes Section */}
        <div className="mb-6 space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="rounded-lg border bg-background p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {note.author}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {note.timestamp}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{note.text}</p>
            </div>
          ))}
        </div>

        {/* Add Note Section */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Add Note
          </Button>
        </form>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            onClick={onEscalate}
          >
            <Flag className="mr-2 h-4 w-4" />
            Escalate
          </Button>
          <Button
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
            onClick={() => onAssign('analyst-id')}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Assign
          </Button>
          <Button
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50"
            onClick={onMarkSafe}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark Safe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
