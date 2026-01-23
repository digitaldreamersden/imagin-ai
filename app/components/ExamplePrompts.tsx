'use client';

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
  "A chef in a busy kitchen, steam rising from pots",
  "Mountain lake at sunrise, pine trees, morning mist",
  "Young woman in a cozy coffee shop, natural window lighting, wearing a cream knit sweater",
  "A neon sign reading 'OPEN 24 HOURS' in a rainy city alley at night",
  "Surreal double exposure portrait, woman's silhouette filled with blooming cherry blossom trees",
];

export default function ExamplePrompts({ onSelectPrompt }: ExamplePromptsProps) {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
        Example Prompts
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXAMPLE_PROMPTS.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt)}
            className="p-3 text-left rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all duration-200 text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label={`Use example prompt: ${prompt.substring(0, 50)}...`}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
