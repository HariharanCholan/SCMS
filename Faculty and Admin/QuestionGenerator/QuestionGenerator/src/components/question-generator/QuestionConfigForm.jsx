import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings2, Zap, Brain } from 'lucide-react';

const QuestionConfigForm = ({
  documents,
  selectedDocId,
  setSelectedDocId,
  questionTypes,
  setQuestionTypes,
  numQuestions,
  setNumQuestions,
  useLLM,
  setUseLLM,
  onGenerate,
  isGenerating,
}) => {
  return (
    <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700/70 glassmorphic">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl text-purple-300">
          <Settings2 className="mr-2 h-7 w-7" />
          Configuration
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Document Selection */}
        <div>
          <Label htmlFor="document-select" className="text-gray-300 block mb-2">
            Select Document
          </Label>
          <select
            id="document-select"
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full p-2.5 rounded-md bg-slate-700 border-slate-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
            disabled={documents.length === 0}
          >
            {documents.length === 0 ? (
              <option value="" disabled>
                No documents available
              </option>
            ) : (
              documents.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.filename}
                </option>
              ))
            )}
          </select>
          {documents.length === 0 && (
            <p className="text-xs text-yellow-400 mt-1">
              Please{' '}
              <a href="/upload" className="underline">
                upload a document
              </a>{' '}
              first.
            </p>
          )}
        </div>

        {/* Question Types */}
        <div>
          <Label className="text-gray-300 block mb-2"></Label>
          <div className="space-y-2">
            {Object.keys(questionTypes || {}).map((typeKey) => (
              <div key={typeKey} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${typeKey}`}
                  checked={questionTypes?.[typeKey] || false}
                  onCheckedChange={(checked) =>
                    setQuestionTypes((prev) => ({
                      ...prev,
                      [typeKey]: checked,
                    }))
                  }
                  className="border-slate-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                />
                <Label
                  htmlFor={`type-${typeKey}`}
                  className="text-gray-300 font-normal capitalize"
                >
                  {typeKey.replace(/([A-Z])/g, ' $1')}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div>
          <Label htmlFor="num-questions" className="text-gray-300 block mb-2">
            Number of Questions: {numQuestions}
          </Label>
          <Slider
            id="num-questions"
            min={1}
            max={20}
            step={1}
            value={[numQuestions]}
            onValueChange={(value) => setNumQuestions(value[0])}
            className="[&>span:first-child]:h-full [&>span:first-child]:bg-purple-500"
          />
        </div>

        {/* AI Mode Toggle */}
        

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={isGenerating || documents.length === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          {isGenerating ? 'Generating...' : 'Generate Questions'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestionConfigForm;
