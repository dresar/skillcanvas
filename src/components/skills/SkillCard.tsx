import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Copy, Check } from 'lucide-react';

export interface Skill {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  imageUrl?: string;
  installCommand: string;
  isFavorited?: boolean;
}

export interface SkillCardProps {
  skill: Skill;
  onFavoriteToggle?: (id: string) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onFavoriteToggle }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(skill.installCommand).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFavorite = () => {
    onFavoriteToggle?.(skill.id);
  };

  const verificationBadge = () => {
    if (skill.verificationStatus === 'verified') {
      return <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-1.5 py-0.5 rounded">Verified</span>;
    }
    if (skill.verificationStatus === 'pending') {
      return <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 px-1.5 py-0.5 rounded">Pending</span>;
    }
    return <span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">Unverified</span>;
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-[16/9] bg-neutral-100 dark:bg-neutral-800">
        {skill.imageUrl ? (
          <img
            src={skill.imageUrl}
            alt={skill.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-neutral-400 dark:text-neutral-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <Link to={`/skills/${skill.slug}`} className="block text-sm font-medium text-neutral-900 dark:text-white hover:underline">
          {skill.title}
        </Link>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {skill.summary}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
            {skill.category}
          </span>
          {verificationBadge()}
        </div>
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleFavorite}
            className={`p-1 rounded-full ${
              skill.isFavorited
                ? 'text-red-500 hover:text-red-600'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-red-400'
            }`}
          >
            <Heart size={16} fill={skill.isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export { SkillCard };
