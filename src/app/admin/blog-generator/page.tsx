'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, Send, Loader2, ExternalLink,
  FileText, Tag, Globe, Eye, EyeOff,
  ChevronDown, Copy, Check, Pencil,
  Home, Image as ImageIcon, Trash2,
  RefreshCcw, Code
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { SITE_URL } from '@/lib/seo';

type FAQItem = {
  question: string;
  answer: string;
};

type GeneratedPost = {
  title: string;
  excerpt: string;
  seo_title?: string;
  meta_description?: string;
  content: string;
  tags: string[];
  seo_slug: string;
  faqs?: FAQItem[];
};

type WPPostSummary = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  link?: string;
};

type PublishResult = {
  postId: number;
  postUrl: string;
  editUrl: string;
  status: string;
};

type UnsplashImage = {
  id: string;
  description?: string;
  alt_description?: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  user?: {
    name?: string;
    username?: string;
  };
  links?: {
    html?: string;
    download_location?: string;
  };
};

const CATEGORIES = ['Guides', 'Visa & Immigration', 'Housing', 'University Life', 'Jobs & Career', 'Language', 'Finance', 'News'];
const TONES = ['informative and friendly', 'professional', 'casual and engaging', 'detailed and academic', 'motivational'];
const LENGTHS = [
  { value: 'short', label: 'Short', desc: '400–600 words' },
  { value: 'medium', label: 'Medium', desc: '700–1000 words' },
  { value: 'long', label: 'Long', desc: '1200–1800 words' },
];

const AI_MODELS = [
  { 
    id: 'google/gemini-2.0-flash-001', 
    name: 'Gemini 2.0 Flash', 
    provider: 'Google',
    inputPrice: 0.0, 
    outputPrice: 0.0,
    desc: 'Fast & free (experimental)'
  },
  { 
    id: 'google/gemini-3.1-flash-lite-preview', 
    name: 'Gemini 3.1 Flash Lite', 
    provider: 'Google',
    inputPrice: 0.25, 
    outputPrice: 1.50,
    desc: 'High efficiency, low cost'
  },
  { 
    id: 'google/gemini-2.5-flash-lite', 
    name: 'Gemini 2.5 Flash Lite', 
    provider: 'Google',
    inputPrice: 0.10, 
    outputPrice: 0.40,
    desc: 'Lightweight & fast'
  },
  { 
    id: 'anthropic/claude-haiku-4.5', 
    name: 'Claude Haiku 4.5', 
    provider: 'Anthropic',
    inputPrice: 1.0, 
    outputPrice: 5.0,
    desc: 'Efficient frontier model'
  },
  { 
    id: 'moonshotai/kimi-k2.5', 
    name: 'Kimi K2.5', 
    provider: 'MoonshotAI',
    inputPrice: 0.45, 
    outputPrice: 2.20,
    desc: 'Multimodal capability'
  },
];

const TOPIC_IDEAS = [
  'How to register your address (Anmeldung) in Berlin',
  'Best student cities in Germany 2025',
  'How to open a bank account in Germany as a student',
  'Understanding the German health insurance system',
  'Top 10 free master programs in Germany for international students',
  'How to find a WG (shared apartment) in Germany',
];

const NEWS_IDEAS = [
  'Germany announces new student visa processing times for 2025',
  'TU Munich ranked among top 10 universities in Europe',
  'New scholarship program for international STEM students',
  'Changes to German blocked account requirements',
  'Berlin introduces new student housing initiative',
  'German universities extend application deadlines',
];

const CATEGORY_SEMANTIC_KEYWORDS: Record<string, string[]> = {
  Guides: ['study in Germany', 'international students Germany', 'Germany student guide'],
  'Visa & Immigration': ['student visa Germany', 'residence permit Germany', 'visa documents Germany'],
  Housing: ['student housing Germany', 'WG Germany', 'renting in Germany as a student'],
  'University Life': ['student life Germany', 'international students Germany', 'German university life'],
  'Jobs & Career': ['student jobs Germany', 'working in Germany as a student', 'career opportunities Germany'],
  Language: ['German language requirements', 'learn German for university', 'language certificate Germany'],
  Finance: ['cost of living Germany', 'student finances Germany', 'budget for students in Germany'],
  News: ['Germany news for students', 'latest Germany updates', 'international students Germany'],
};

function normalizeKeywordSuggestion(value: string) {
  return value
    .replace(/[()]/g, ' ')
    .replace(/[^A-Za-z0-9&/\-\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTopicLocation(topic: string) {
  const match = topic.match(/\bin\s+([A-Z][A-Za-z-]+(?:\s+[A-Z][A-Za-z-]+)*)/);
  return match?.[1]?.trim() ?? '';
}

function uniqueKeywordSuggestions(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((value) => normalizeKeywordSuggestion(value))
        .filter(Boolean)
    )
  );
}

function buildFocusKeywordSuggestion(
  topic: string,
  contentType: 'blog' | 'news'
) {
  const cleanedTopic = normalizeKeywordSuggestion(topic);
  if (!cleanedTopic) return '';

  if (contentType === 'news') {
    return cleanedTopic.replace(/\b20\d{2}\b/g, '').replace(/\s+/g, ' ').trim();
  }

  const parenthetical = topic.match(/\(([^)]+)\)/)?.[1]?.trim() ?? '';
  const location = getTopicLocation(topic);
  const lowered = cleanedTopic.toLowerCase();

  if (parenthetical && /register your address|address registration|anmeldung/.test(lowered)) {
    return normalizeKeywordSuggestion(`${parenthetical}${location ? ` in ${location}` : ' Germany'}`);
  }

  const simplified = cleanedTopic
    .replace(/^(how to|guide to|complete guide to|understanding|best|top \d+|what is|how can|steps to|changes to)\s+/i, '')
    .replace(/\b20\d{2}\b/g, '')
    .replace(/\b(for|in|on|at|with)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  return simplified || cleanedTopic;
}

function buildSemanticKeywordSuggestion(
  topic: string,
  category: string,
  contentType: 'blog' | 'news',
  focusKeyword: string
) {
  const cleanedTopic = normalizeKeywordSuggestion(topic);
  if (!cleanedTopic) return '';

  const location = getTopicLocation(topic);
  const parenthetical = topic.match(/\(([^)]+)\)/)?.[1]?.trim() ?? '';
  const lowered = cleanedTopic.toLowerCase();
  const suggestions: string[] = [];

  suggestions.push(
    ...(contentType === 'news'
      ? ['Germany news', 'international students Germany']
      : ['study in Germany', 'international students Germany'])
  );

  if (location) {
    suggestions.push(`${location} international students`, `${location} student life`);
  }

  if (parenthetical) {
    suggestions.push(parenthetical);
  }

  if (/visa/.test(lowered)) {
    suggestions.push('student visa Germany', 'visa documents Germany', 'blocked account Germany', 'German embassy appointment');
  }

  if (/blocked account|sperrkonto/.test(lowered)) {
    suggestions.push('blocked account Germany', 'student visa finances Germany', 'Expatrio blocked account', 'Fintiba blocked account');
  }

  if (/register your address|address registration|anmeldung/.test(lowered)) {
    suggestions.push('address registration Germany', 'Anmeldung Germany', 'Buergeramt appointment', 'Anmeldung documents');
  }

  if (/bank account/.test(lowered)) {
    suggestions.push('student bank account Germany', 'documents for bank account Germany', 'German bank account students');
  }

  if (/health insurance/.test(lowered)) {
    suggestions.push('student health insurance Germany', 'public health insurance Germany', 'health insurance for international students');
  }

  if (/housing|apartment|accommodation|wg/.test(lowered)) {
    suggestions.push('student housing Germany', 'WG Germany', 'shared apartment Germany');
  }

  if (/scholarship/.test(lowered)) {
    suggestions.push('scholarships in Germany', 'DAAD scholarship', 'funding for international students Germany');
  }

  if (/deadline/.test(lowered)) {
    suggestions.push('German university application deadline', 'winter semester application Germany', 'summer semester application Germany');
  }

  if (/university|program|master|bachelor/.test(lowered)) {
    suggestions.push('German universities', 'English taught programs Germany', 'study programs in Germany');
  }

  suggestions.push(...(CATEGORY_SEMANTIC_KEYWORDS[category] || []));

  return uniqueKeywordSuggestions(suggestions)
    .filter((keyword) => keyword.toLowerCase() !== focusKeyword.toLowerCase())
    .slice(0, 6)
    .join(', ');
}

function stripHtmlTags(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const formatPhotographer = (image: UnsplashImage | null) => {
  if (!image?.user?.name) return null;
  return `Photo by ${image.user.name}${image.user.username ? ` (@${image.user.username})` : ''}`;
};

const formatPostDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const buildCanonicalUrl = (slug: string) => `${SITE_URL}/blog/${slug}`;

export default function BlogGeneratorPage() {
  // Form state
  const [contentType, setContentType] = useState<'blog' | 'news'>('blog');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('informative and friendly');
  const [length, setLength] = useState('medium');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [semanticKeywords, setSemanticKeywords] = useState('');
    const [category, setCategory] = useState('Guides');
  const [selectedModel] = useState('google/gemini-2.0-flash-001');
  const [wpCategories, setWpCategories] = useState<string[]>(CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [publishStatus] = useState<'draft' | 'publish'>('draft');
  const [showInTicker, setShowInTicker] = useState(false);

  // Process state
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [pubError, setPubError] = useState<string | null>(null);

  // Result state
  const [post, setPost] = useState<GeneratedPost | null>(null);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [previewHtml, setPreviewHtml] = useState(true);
  const [copied, setCopied] = useState(false);

  // Unsplash state
  const [imageQuery, setImageQuery] = useState('');
  const [imageResults, setImageResults] = useState<UnsplashImage[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
  const [featuredMediaId, setFeaturedMediaId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Existing posts state
  const [existingPosts, setExistingPosts] = useState<WPPostSummary[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [postsSearch, setPostsSearch] = useState('');
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  // Editable fields after generation
  const [editTitle, setEditTitle] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  
  // Collapsible sections state
  const [showWordPressSettings, setShowWordPressSettings] = useState(false);
  const [showSEOSettings, setShowSEOSettings] = useState(false);
  const [showRecentPosts, setShowRecentPosts] = useState(false);

  const loadExistingPosts = async (query?: string) => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      const params = new URLSearchParams({ per_page: '15' });
      if (query?.trim()) {
        params.set('search', query.trim());
      }
      const res = await fetch(`/api/wp-posts?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch posts');
      setExistingPosts(data.posts || []);
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : 'Unable to load posts');
      setExistingPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    loadExistingPosts();
  }, []);

  
  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Delete this WordPress post? This cannot be undone.')) return;
    setDeletingPostId(id);
    try {
      const res = await fetch('/api/wp-blog/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete post');
      setExistingPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setDeletingPostId(null);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/wp-blog/categories');
        const data = await res.json();
        if (res.ok && Array.isArray(data.categories)) {
          const uniqueNames = Array.from(
            new Set([
              ...CATEGORIES,
              ...data.categories.map((cat: { name: string }) => cat.name),
            ])
          );
          setWpCategories(uniqueNames);
          if (!uniqueNames.includes(category)) {
            setCategory(uniqueNames[0] || 'Guides');
          }
        }
      } catch (error) {
        console.warn('Failed to load categories', error);
      }
    };
    loadCategories();
  }, [category]);

  const handleAddCategory = () => {
    const next = newCategoryName.trim();
    if (!next) return;
    if (!wpCategories.includes(next)) {
      setWpCategories((prev) => [...prev, next]);
    }
    setCategory(next);
    setNewCategoryName('');
  };

  const handleFaqChange = (idx: number, field: keyof FAQItem, value: string) => {
    setFaqs((prev) => prev.map((faq, i) => (i === idx ? { ...faq, [field]: value } : faq)));
  };

  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUnsplashSearch = async (customQuery?: string) => {
    const finalQuery = (customQuery ?? imageQuery).trim();
    if (!finalQuery) {
      setImageError('Enter a keyword to search Unsplash');
      return;
    }

    setImageQuery(finalQuery);
    setImageLoading(true);
    setImageError(null);

    try {
      const res = await fetch(`/api/wp-blog/images?q=${encodeURIComponent(finalQuery)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch images');
      setImageResults(data.results || []);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Failed to fetch images');
      setImageResults([]);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSelectImage = (image: UnsplashImage) => {
    setSelectedImage(image);
    setFeaturedMediaId(null);
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setFeaturedMediaId(null);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setGenerating(true);
    setGenError(null);
    setPost(null);
    setPublishResult(null);
    setSelectedImage(null);
    setFeaturedMediaId(null);
    setShowInTicker(false);
    setSeoTitle('');
    setMetaDescription('');
    setCanonicalUrl('');
    setFaqs([]);

    try {
      const res = await fetch('/api/wp-blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          tone,
          length,
          focusKeyword,
          semanticKeywords,
          category,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      const p: GeneratedPost = data.post;
      setPost(p);
      setEditTitle(p.title);
      setEditExcerpt(p.excerpt);
      setEditContent(p.content);
      setEditTags(p.tags.join(', '));
      setSeoTitle(p.seo_title || p.title);
      setMetaDescription(p.meta_description || p.excerpt);
      setCanonicalUrl(buildCanonicalUrl(p.seo_slug));
      const generatedFaqs = Array.isArray(p.faqs) ? p.faqs : [];
      setFaqs(
        generatedFaqs.length
          ? generatedFaqs
          : [
              { question: `What is ${topic.trim()}?`, answer: '' },
              { question: `How to get started with ${category}?`, answer: '' },
            ]
      );
      const defaultQuery = topic.trim() || p.tags?.[0] || 'Germany student';
      setImageQuery(defaultQuery);
      handleUnsplashSearch(defaultQuery);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!post) return;
    setPublishing(true);
    setPubError(null);

    try {
      let mediaId = featuredMediaId;
      if (selectedImage && !featuredMediaId) {
        setUploadingImage(true);
        const uploadRes = await fetch('/api/wp-blog/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: selectedImage.urls.regular,
            filename: `${post.seo_slug}.jpg`,
            altText: selectedImage.alt_description || selectedImage.description,
            credit: selectedImage.user?.name
              ? `Photo by ${selectedImage.user.name} on Unsplash`
              : 'Photo via Unsplash',
            downloadLocation: selectedImage.links?.download_location,
          }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload image');
        mediaId = uploadData.id;
        setFeaturedMediaId(uploadData.id);
      }

      setUploadingImage(false);

      const res = await fetch('/api/wp-blog/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          excerpt: editExcerpt,
          seoTitle,
          metaDescription,
          canonicalUrl,
          tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
          status: publishStatus,
          slug: post.seo_slug,
          featuredMediaId: mediaId ?? undefined,
          categoryName: category,
          showInTicker,
          faqs,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Publish failed');
      setPublishResult(data);
    } catch (err) {
      setPubError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setUploadingImage(false);
      setPublishing(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(editContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '114px 24px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(221,0,0,0.2)' }}>
              <Sparkles className="w-8 h-8" style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px' }}>AI Blog Generator</h1>
              <p style={{ fontSize: 15, color: '#737373', margin: 0 }}>Create and publish blog posts for Students in Germany</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#666', background: '#fff', border: '1px solid #e5e5e5', textDecoration: 'none', transition: 'all 0.2s' }}>
              <Home className="w-4 h-4" />
              Home
            </Link>
            <a
              href="https://cms.germanpath.com/wp-admin"
              target="_blank"
              rel="noopener"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#666', background: '#fff', border: '1px solid #e5e5e5', textDecoration: 'none', transition: 'all 0.2s' }}
            >
              <Globe className="w-4 h-4" />
              WP Admin
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Content Type Toggle */}
          <div style={{ display: 'flex', background: '#f4f4f5', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            <button
              onClick={() => {
                setContentType('blog');
                setCategory('Guides');
                setLength('medium');
                setTone('informative and friendly');
                if (showInTicker && contentType === 'news') {
                  setShowInTicker(false);
                }
                setPreviewHtml(false);
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 10,
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: contentType === 'blog' ? '#fff' : 'transparent',
                color: contentType === 'blog' ? '#111' : '#737373',
                boxShadow: contentType === 'blog' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              📝 Blog Post
            </button>
            <button
              onClick={() => {
                setContentType('news');
                setCategory('News');
                setLength('short');
                setTone('professional');
                if (!showInTicker && contentType === 'blog') {
                  setShowInTicker(true);
                }
                setPreviewHtml(true);
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 10,
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: contentType === 'news' ? '#fff' : 'transparent',
                color: contentType === 'news' ? '#dd0000' : '#737373',
                boxShadow: contentType === 'news' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              📰 News Article
            </button>
          </div>

            {/* Topic Input */}
            <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <FileText className="w-5 h-5" style={{ color: '#dd0000' }} />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>{contentType === 'news' ? 'News Headline' : 'Blog Topic'}</h2>
              </div>
              <textarea
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  console.log('Topic changed:', e.target.value);
                }}
                placeholder={contentType === 'news' ? 'e.g. Germany announces new visa rules for international students' : 'e.g. How to apply for a student visa in Germany'}
                rows={3}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', resize: 'vertical', fontFamily: 'inherit', transition: 'all 0.2s' }}
              />
              {contentType === 'news' && (
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  📰 News articles are optimized for ticker display. Use the checkbox below to control ticker visibility.
                </p>
              )}
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 13, color: '#737373', marginBottom: 8 }}>Quick ideas:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(contentType === 'news' ? NEWS_IDEAS : TOPIC_IDEAS).map((idea) => (
                    <button
                      key={idea}
                      onClick={() => setTopic(idea)}
                      style={{ fontSize: 11, padding: '6px 12px', borderRadius: 20, border: '1px solid #e5e5e5', background: '#fff', color: '#666', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#dd0000'; e.currentTarget.style.color = '#dd0000'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#666'; }}
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            </section>

        {/* Settings */}
            <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Tag className="w-5 h-5" style={{ color: '#dd0000' }} />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>Settings</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Category */}
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Category</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', cursor: 'pointer', fontWeight: 600, appearance: 'none' }}
                    >
                      {wpCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Add new category"
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, fontWeight: 600, color: '#666', background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Tone</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', cursor: 'pointer', fontWeight: 600, appearance: 'none' }}
                    >
                      {TONES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Length */}
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Length</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {LENGTHS.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => setLength(l.value)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: 10,
                          border: '1px solid #e5e5e5',
                          fontSize: 12,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2,
                          background: length === l.value ? '#dd0000' : '#fff',
                          color: length === l.value ? '#fff' : '#666',
                          borderColor: length === l.value ? '#dd0000' : '#e5e5e5'
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{l.label}</span>
                        <span style={{ fontSize: 10, opacity: 0.7 }}>{l.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Focus Keyword */}
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Focus Keyword</label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="e.g. student visa Germany"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                  />
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '6px 0 0' }}>
                    Optional - AI will generate appropriate keywords if left empty
                  </p>
                </div>

                {/* Semantic Keywords */}
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Semantic Keywords</label>
                  <input
                    type="text"
                    value={semanticKeywords}
                    onChange={(e) => setSemanticKeywords(e.target.value)}
                    placeholder="e.g. blocked account, embassy appointment, visa documents"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                  />
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '6px 0 0' }}>
                    Optional - AI will generate supporting terms if left empty
                  </p>
                </div>

                {/* Generate Button */}
                <button
                  onClick={() => {
                    console.log('Generate clicked, topic:', topic);
                    handleGenerate();
                  }}
                  disabled={!topic.trim() || generating}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#fff',
                    background: generating || !topic.trim() ? '#ccc' : 'linear-gradient(135deg, #dd0000, #7c3aed)',
                    border: 'none',
                    cursor: generating || !topic.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: generating || !topic.trim() ? 'none' : '0 4px 16px rgba(221,0,0,0.2)',
                    opacity: generating || !topic.trim() ? 0.5 : 1
                  }}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Post
                    </>
                  )}
                </button>

                {/* Debug info */}
                <div style={{ fontSize: 11, color: '#999', marginTop: 8 }}>
                  Debug: Topic length = {topic.length}, Topic = "{topic}"
                </div>

                {genError && (
                  <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontSize: 13 }}>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>Generation failed</p>
                    <p>{genError}</p>
                  </div>
                )}
              </div>
            </section>

          {/* Recent WordPress Posts - Collapsible */}
          <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, overflow: 'hidden', marginTop: 24 }}>
            <button
              onClick={() => setShowRecentPosts(!showRecentPosts)}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: '#fafafa',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>Recent WordPress Posts (optional)</h2>
              <ChevronDown style={{ width: 16, height: 16, transform: showRecentPosts ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>
            {showRecentPosts && (
              <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => loadExistingPosts(postsSearch)}
                    style={{ border: '1px solid #e5e5e5', background: '#fff', borderRadius: 10, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555' }}
                  >
                    <RefreshCcw size={14} /> Refresh
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  type="text"
                  value={postsSearch}
                  onChange={(e) => setPostsSearch(e.target.value)}
                  placeholder="Search WP posts"
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 13 }}
                />
                <button
                  onClick={() => loadExistingPosts(postsSearch)}
                  style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: '#111', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Search
                </button>
              </div>
              {postsError && <p style={{ color: '#dc2626', fontSize: 13 }}>{postsError}</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {postsLoading ? (
                  <p style={{ fontSize: 13, color: '#737373' }}>Loading posts…</p>
                ) : existingPosts.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#737373' }}>No posts found.</p>
                ) : (
                  existingPosts.map((wp) => {
                    const plainTitle = stripHtmlTags(wp.title);
                    const plainExcerpt = stripHtmlTags(wp.excerpt).slice(0, 140);
                    return (
                      <div key={wp.id} style={{ border: '1px solid #f0f0f0', borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 4px' }}>{formatPostDate(wp.date)}</p>
                          <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 6px' }}>{plainTitle || 'Untitled Post'}</p>
                          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{plainExcerpt}{plainExcerpt.length === 140 ? '…' : ''}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <a
                            href={wp.link || `https://cms.germanpath.com/${wp.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'none', fontSize: 12, fontWeight: 600, color: '#2563eb', textAlign: 'center' }}
                          >
                            View
                          </a>
                          <button
                            onClick={() => handleDeletePost(wp.id)}
                            disabled={deletingPostId === wp.id}
                            style={{ border: '1px solid #ffe4e6', background: '#fff1f2', color: '#dc2626', borderRadius: 10, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: deletingPostId === wp.id ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <Trash2 size={12} /> {deletingPostId === wp.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              </div>
            )}
          </section>
            {post && (
              <>
                {/* Generated Content */}
                <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ padding: 24, borderBottom: '1px solid #f5f5f5', background: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText className="w-5 h-5" style={{ color: '#dd0000' }} />
                        Generated Content
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          onClick={() => setPreviewHtml(!previewHtml)}
                          style={{ padding: '8px', borderRadius: 8, border: '1px solid #e5e5e5', color: '#666', background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
                          title={previewHtml ? 'Show raw' : 'Show preview'}
                        >
                          {previewHtml ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={handleCopyContent}
                          style={{ padding: '8px', borderRadius: 8, border: '1px solid #e5e5e5', color: '#666', background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
                          title="Copy content"
                        >
                          {copied ? <Check className="w-4 h-4" style={{ color: '#10b981' }} /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Core Fields - Always Visible */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Excerpt</label>
                        <textarea
                          value={editExcerpt}
                          onChange={(e) => setEditExcerpt(e.target.value)}
                          rows={2}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', resize: 'vertical' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="visa, germany, student"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                        />
                      </div>

                      {/* WordPress Settings - Collapsible */}
                      <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
                        <button
                          onClick={() => setShowWordPressSettings(!showWordPressSettings)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: '#fafafa',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>WordPress Settings (optional)</span>
                          <ChevronDown style={{ width: 16, height: 16, transform: showWordPressSettings ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                        </button>
                        {showWordPressSettings && (
                          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ border: '1px solid #f0f4f8', borderRadius: 12, padding: 16, background: '#fafbfc' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <input
                                  type="checkbox"
                                  id="showInTicker"
                                  checked={showInTicker}
                                  onChange={(e) => setShowInTicker(e.target.checked)}
                                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                                />
                                <div>
                                  <label htmlFor="showInTicker" style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', margin: 0, cursor: 'pointer' }}>
                                    📰 Show in News Ticker
                                  </label>
                                  <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>
                                    {showInTicker 
                                      ? 'This content will appear in the news ticker on the homepage' 
                                      : 'This content will only appear in the blog/articles section'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div style={{ border: '1px solid #f5f5f5', borderRadius: 16, padding: 16, background: '#fff' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <ImageIcon className="w-4 h-4" style={{ color: '#dd0000' }} />
                                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737373' }}>Featured Image</span>
                                </div>
                                {selectedImage && (
                                  <button
                                    onClick={clearSelectedImage}
                                    style={{ fontSize: 12, color: '#dd0000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: 220 }}>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <input
                                      type="text"
                                      value={imageQuery}
                                      onChange={(e) => setImageQuery(e.target.value)}
                                      placeholder="Search Unsplash (e.g. German campus)"
                                      style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 13 }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleUnsplashSearch()}
                                      disabled={imageLoading}
                                      style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: '#111', color: '#fff', fontWeight: 600, cursor: imageLoading ? 'not-allowed' : 'pointer' }}
                                    >
                                      {imageLoading ? 'Searching…' : 'Search'}
                                    </button>
                                  </div>
                                  {imageError && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 8 }}>{imageError}</p>}
                                  {selectedImage && (
                                    <div style={{ marginTop: 12, border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
                                      <img src={selectedImage.urls.small} alt={selectedImage.alt_description || ''} style={{ width: '100%', display: 'block' }} />
                                      {formatPhotographer(selectedImage) && (
                                        <p style={{ fontSize: 11, color: '#71717a', margin: 0, padding: '6px 10px', background: '#fafafa' }}>
                                          {formatPhotographer(selectedImage)} · Unsplash
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div style={{ flex: 1, minWidth: 220, maxHeight: 220, overflowY: 'auto', border: '1px solid #f4f4f5', borderRadius: 12, padding: 10, background: '#fafafa' }}>
                                  {imageResults.length === 0 && !imageLoading ? (
                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Search Unsplash to pick a hero image.</p>
                                  ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
                                      {imageResults.map((img) => (
                                        <button
                                          key={img.id}
                                          onClick={() => handleSelectImage(img)}
                                          style={{
                                            border: selectedImage?.id === img.id ? '2px solid #dd0000' : '2px solid transparent',
                                            borderRadius: 10,
                                            padding: 0,
                                            background: 'none',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          <img src={img.urls.small} alt={img.alt_description || ''} style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 8 }} />
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SEO Settings - Collapsible */}
                      <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
                        <button
                          onClick={() => setShowSEOSettings(!showSEOSettings)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: '#fafafa',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>SEO Settings (optional)</span>
                          <ChevronDown style={{ width: 16, height: 16, transform: showSEOSettings ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                        </button>
                        {showSEOSettings && (
                          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                              <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                                SEO Title
                              </label>
                              <input
                                type="text"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                              />
                              <p style={{ fontSize: 11, color: seoTitle.length > 60 ? '#dc2626' : '#94a3b8', margin: '6px 0 0' }}>
                                {seoTitle.length}/60 characters
                              </p>
                            </div>
                            <div>
                              <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                                Meta Description
                              </label>
                              <textarea
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                rows={3}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', resize: 'vertical' }}
                              />
                              <p style={{ fontSize: 11, color: metaDescription.length > 155 ? '#dc2626' : '#94a3b8', margin: '6px 0 0' }}>
                                {metaDescription.length}/155 characters
                              </p>
                            </div>
                            <div>
                              <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                                Canonical URL
                              </label>
                              <input
                                type="url"
                                value={canonicalUrl}
                                onChange={(e) => setCanonicalUrl(e.target.value)}
                                placeholder={`${SITE_URL}/blog/${post?.seo_slug || 'your-post-slug'}`}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Content Preview</label>
                      <button
                        onClick={() => setPreviewHtml(!previewHtml)}
                        style={{ 
                          padding: '6px 12px', 
                          borderRadius: 8, 
                          border: '1px solid #e5e5e5', 
                          background: '#fff', 
                          fontSize: 12, 
                          fontWeight: 600, 
                          color: '#666', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        {previewHtml ? <><Code className="w-3 h-3" /> Edit HTML</> : <><Eye className="w-3 h-3" /> Preview</>}
                      </button>
                    </div>
                    {previewHtml ? (
                      <div style={{ border: '1px solid #e5e5e5', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
                        <div style={{ padding: 20, background: '#fdf2f2', borderBottom: '1px solid #ffe4e6' }}>
                          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#dd0000' }}>
                            {contentType === 'news' ? 'News Article Preview' : 'Blog Preview'}
                          </span>
                        </div>
                        <article style={{ padding: 24 }}>
                          {selectedImage && (
                            <img
                              src={selectedImage.urls.small}
                              alt={selectedImage.alt_description || 'Preview image'}
                              style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 220, marginBottom: 20 }}
                            />
                          )}
                          <div>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 8px' }}>
                              {contentType === 'news' ? 'Breaking Update · Germany' : category}
                            </p>
                            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', margin: '0 0 12px', lineHeight: 1.3 }}>
                              {editTitle || post.title}
                            </h1>
                            <p style={{ fontSize: 15, color: '#4b5563', margin: '0 0 24px', lineHeight: 1.6 }}>
                              {stripHtmlTags(editExcerpt || post.excerpt)}
                            </p>
                          </div>
                          <div style={{ color: '#374151', fontSize: 16, lineHeight: 1.8 }}
                            dangerouslySetInnerHTML={{ __html: (editContent || post.content)
                              .replace(/<h2>/g, '<h2 style="font-size: 22px; font-weight: 700; color: #111; margin: 32px 0 16px; line-height: 1.3;">')
                              .replace(/<h3>/g, '<h3 style="font-size: 19px; font-weight: 600; color: #111; margin: 24px 0 12px; line-height: 1.4;">')
                              .replace(/<p>/g, '<p style="margin: 16px 0; line-height: 1.8;">')
                              .replace(/<ul>/g, '<ul style="margin: 16px 0; padding-left: 28px; line-height: 1.8;">')
                              .replace(/<ol>/g, '<ol style="margin: 16px 0; padding-left: 28px; line-height: 1.8;">')
                              .replace(/<li>/g, '<li style="margin: 8px 0;">')
                              .replace(/<strong>/g, '<strong style="font-weight: 600; color: #111;">')
                            }}
                          />
                          {faqs && faqs.length > 0 && (
                            <div style={{ marginTop: 40, padding: 24, background: '#f9fafb', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 20px' }}>Frequently Asked Questions</h2>
                              {faqs.map((faq, idx) => (
                                <div key={idx} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: idx < faqs.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                                  <h3 style={{ fontSize: 17, fontWeight: 600, color: '#111', margin: '0 0 10px' }}>{faq.question}</h3>
                                  <p style={{ fontSize: 15, color: '#4b5563', margin: 0, lineHeight: 1.7 }}>{faq.answer}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </article>
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={12}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e5e5', background: '#fff', fontSize: 14, color: '#111', outline: 'none', resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.6 }}
                        />
                      </div>
                    )}
                  </div>
                </section>

                {/* Publish Actions */}
                <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Send className="w-5 h-5" style={{ color: '#dd0000' }} />
                    Publish to WordPress
                  </h3>

                  {publishResult ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 13 }}>
                        <p style={{ fontWeight: 600, marginBottom: 4 }}>Published successfully!</p>
                        <p style={{ marginBottom: 8 }}>Post ID: {publishResult.postId}</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <a
                            href={publishResult.postUrl}
                            target="_blank"
                            rel="noopener"
                            style={{ color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Post
                          </a>
                          <a
                            href={publishResult.editUrl}
                            target="_blank"
                            rel="noopener"
                            style={{ color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setPost(null);
                          setPublishResult(null);
                          setEditTitle('');
                          setEditExcerpt('');
                          setEditContent('');
                          setEditTags('');
                          setSeoTitle('');
                          setMetaDescription('');
                          setCanonicalUrl('');
                          setFaqs([]);
                          setSelectedImage(null);
                          setFeaturedMediaId(null);
                        }}
                        style={{ width: '100%', padding: '10px 16px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, fontWeight: 600, color: '#666', background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        Create New Post
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <button
                        onClick={handlePublish}
                        disabled={!editTitle.trim() || !editContent.trim() || publishing}
                        style={{
                          width: '100%',
                          padding: '14px 24px',
                          borderRadius: 12,
                          fontSize: 15,
                          fontWeight: 700,
                          color: '#fff',
                          background: publishing || !editTitle.trim() || !editContent.trim() ? '#ccc' : 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none',
                          cursor: publishing || !editTitle.trim() || !editContent.trim() ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: publishing || !editTitle.trim() || !editContent.trim() ? 'none' : '0 4px 16px rgba(16,185,129,0.2)',
                          opacity: publishing || !editTitle.trim() || !editContent.trim() ? 0.5 : 1
                        }}
                      >
                        {publishing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Publishing to WordPress...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Publish to WordPress
                          </>
                        )}
                      </button>

                      {pubError && (
                        <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontSize: 13 }}>
                          <p style={{ fontWeight: 600, marginBottom: 4 }}>Publish failed</p>
                          <p>{pubError}</p>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* Empty State */}
            {!post && (
              <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 48, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, margin: '0 auto 24px', borderRadius: 20, background: '#fafafa', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles className="w-8 h-8" style={{ color: '#999' }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111', marginBottom: 8 }}>No content generated yet</h3>
                <p style={{ fontSize: 14, color: '#737373', marginBottom: 24 }}>
                  Enter a topic and click &quot;Generate Post&quot; to create your blog content
                </p>
              </section>
            )}
        </div>
      </main>
    </div>
  );
}
