import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Check, Send, Trash2, X } from 'lucide-react';
import { getCurrentRole, getSkills } from '../../lib/storage';

type Message = { role: 'user' | 'assistant'; content: string };

const suggestions = ['Recommend UI skills', 'Coding orchestrators', 'Security scanner tools'];

function answer(prompt: string): string {
  const skills = getSkills() as Array<{ name?: string; summary?: string; tags?: string[] }>;
  const query = prompt.toLowerCase();
  const matches = skills
    .filter((skill) => `${skill.name} ${skill.summary} ${(skill.tags || []).join(' ')}`.toLowerCase().includes(query))
    .slice(0, 3);

  if (matches.length) {
    return `I found ${matches.length} relevant skill${matches.length === 1 ? '' : 's'}: ${matches.map((skill) => skill.name).join(', ')}.`;
  }

  if (query.includes('security')) {
    return 'Try the security and rules category for auditing, scanners, and defensive policy skills.';
  }

  if (query.includes('ui') || query.includes('design')) {
    return 'Start with UI & Design Systems for compact interface primitives and visual workflow skills.';
  }

  return 'Ask me about a use case, category, or skill name and I will search the SkillCanvas index.';
}

export default function SkillAIAssistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Tell me what you want to build or improve.' },
  ]);

  const submit = async (prompt = draft) => {
    const value = prompt.trim();

    if (!value || loading) return;

    const conversation = [...messages, { role: 'user' as const, content: value }];
    setMessages(conversation);
    setDraft('');
    setLoading(true);

    try {
      const endpoint = 'https:' + '//router.bynara.id/v1/chat/completions';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer sk-nry-0KAezWyaGVZKiUSPmcBpT44F84a7jocNlZCCY7bLn9g',
        },
        body: JSON.stringify({
          model: 'gpt-5.6-luna',
          messages: [
            {
              role: 'system',
              content:
                'You are SkillCanvas AI, a professional AI agent skills advisor. Help users find, evaluate, and integrate agent skills, workflows, and tools from the SkillCanvas directory.',
            },
            ...conversation.map((message) => ({ role: message.role, content: message.content })),
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('AI response was empty');
      }

      setMessages((current) => [...current, { role: 'assistant', content }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: answer(value) }]);
    } finally {
      setLoading(false);
    }
  };

  const signedIn = getCurrentRole() !== 'visitor';

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="fixed bottom-20 right-5 z-50 flex h-[min(620px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                    {signedIn ? 'Skill Assistant' : 'SkillCanvas AI'}
                  </div>
                  {signedIn && (
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-900 dark:hover:text-white"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {signedIn ? (
              <>
                <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-500">Quick suggestions</span>
                    <button
                      type="button"
                      onClick={() => setMessages([])}
                      disabled={loading || messages.length === 0}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-neutral-900 dark:hover:text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void submit(suggestion)}
                        disabled={loading}
                        className="rounded-full border border-neutral-200 px-2.5 py-1.5 text-[11px] text-neutral-600 transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm leading-5 ${
                        message.role === 'user'
                          ? 'ml-auto bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex w-fit items-center gap-1 rounded-xl bg-neutral-100 px-3.5 py-3 dark:bg-neutral-900">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void submit();
                  }}
                  className="flex gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800"
                >
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask about a skill"
                    disabled={loading}
                    className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500 disabled:opacity-50 dark:border-neutral-800"
                  />
                  <button
                    type="submit"
                    disabled={loading || !draft.trim()}
                    className="rounded-lg bg-neutral-950 p-2.5 text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-lg dark:bg-white dark:text-neutral-950">
                  <Bot className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                  SkillCanvas AI Intelligence
                </h2>
                <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                  Sign in with your member or admin account to consult our agent skill models, compare workflows, and discover custom tools.
                </p>
                <a
                  href="/login"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                >
                  <Check className="h-4 w-4" />
                  Sign In / Join
                </a>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white shadow-lg transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        aria-label={open ? 'Close skill assistant' : 'Open skill assistant'}
        aria-expanded={open}
      >
        <Bot className="h-5 w-5" />
      </motion.button>
    </>
  );
}
