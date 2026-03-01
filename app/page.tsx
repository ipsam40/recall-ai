'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PencilSquareIcon,
  AcademicCapIcon,
  CodeBracketSquareIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  PlusIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon, SparklesIcon as SparklesSolid } from '@heroicons/react/24/solid';

const actionChips = [
  { icon: PencilSquareIcon, label: 'Write' },
  { icon: AcademicCapIcon, label: 'Learn' },
  { icon: CodeBracketSquareIcon, label: 'Code' },
  { icon: RocketLaunchIcon, label: 'Research' },
  { icon: SparklesIcon, label: 'Analyze' },
];

const models = [
  { id: 'opus', name: 'Opus 4.6', desc: 'Most capable for ambitious work', badge: null },
  { id: 'sonnet', name: 'Sonnet 4.6', desc: 'Most efficient for everyday tasks', badge: '✓' },
  { id: 'haiku', name: 'Haiku 4.5', desc: 'Fastest for quick answers', badge: null },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('sonnet');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [extendedThinking, setExtendedThinking] = useState(true);
  const [greeting, setGreeting] = useState('');
  const router = useRouter();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const currentModel = models.find(m => m.id === selectedModel)!;

  const handleSubmit = () => {
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="page-content">
      <div className="home-container">
        <div className="home-greeting animate-fade">
          <SparklesSolid style={{ width: 36, height: 36, color: 'var(--accent)' }} />
          {greeting}, Ashutosh
        </div>

        <div className="home-input-container animate-slide-up">
          <div className="chat-input-wrapper" style={{ borderRadius: '24px', padding: '16px 20px' }}>
            <textarea
              className="chat-input"
              placeholder="How can I help you today?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="btn-icon" title="Attach file" style={{ width: '32px', height: '32px' }}>
                <PlusIcon style={{ width: 18, height: 18 }} />
              </button>
              <button
                className="chat-send-btn"
                onClick={handleSubmit}
                disabled={!query.trim()}
              >
                <ArrowUpIcon style={{ width: 18, height: 18 }} />
              </button>
            </div>
          </div>

          <div className="home-input-row">
            <div style={{ position: 'relative' }}>
              <button
                className="home-model-selector"
                onClick={() => setShowModelSelector(!showModelSelector)}
              >
                {currentModel.name} {extendedThinking ? 'Extended' : ''} <ChevronDownIcon style={{ width: 14, height: 14 }} />
              </button>

              {showModelSelector && (
                <div className="model-selector-dropdown" style={{ left: 0, right: 'auto' }}>
                  {models.map((model) => (
                    <div
                      key={model.id}
                      className="model-option"
                      onClick={() => { setSelectedModel(model.id); setShowModelSelector(false); }}
                    >
                      <div>
                        <div className="model-option-name">{model.name}</div>
                        <div className="model-option-desc">{model.desc}</div>
                      </div>
                      {selectedModel === model.id && <CheckIcon style={{ width: 18, height: 18, color: 'var(--accent)' }} />}
                    </div>
                  ))}
                  <div className="model-thinking-row">
                    <div>
                      <div className="model-thinking-label">
                        <SparklesIcon style={{ width: 16, height: 16, display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                        Extended thinking
                      </div>
                      <div className="model-thinking-desc">Think longer for complex tasks</div>
                    </div>
                    <div
                      className={`toggle ${extendedThinking ? 'active' : ''}`}
                      onClick={() => setExtendedThinking(!extendedThinking)}
                    />
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className="btn-icon" title="Voice input" style={{ width: '32px', height: '32px' }}>
                <MicrophoneIcon style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </div>

        <div className="home-actions animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {actionChips.map((chip) => (
            <button key={chip.label} className="home-action-chip">
              <chip.icon style={{ width: 16, height: 16 }} /> {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
