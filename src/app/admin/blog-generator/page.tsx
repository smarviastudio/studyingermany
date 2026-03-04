'use client';

import { useEffect, useState } from 'react';
import {
  Sparkles, Send, Loader2, CheckCircle, ExternalLink,
  FileText, Tag, Globe, RefreshCw, Eye, EyeOff,
  ChevronDown, AlertCircle, Copy, Check, Pencil,
  Image as ImageIcon, Search
} from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
};

type GeneratedPost = {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  seo_slug: string;
  faqs?: FAQItem[];
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

const TOPIC_IDEAS = [
  'How to register your address (Anmeldung) in Berlin',
  'Best student cities in Germany 2025',
  'How to open a bank account in Germany as a student',
  'Understanding the German health insurance system',
  'Top 10 free master programs in Germany for international students',
  'How to find a WG (shared apartment) in Germany',
];

export default function BlogGeneratorPage() {
  // Form state
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('informative and friendly');
  const [length, setLength] = useState('medium');
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('Guides');
  const [wpCategories, setWpCategories] = useState<string[]>(CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [publishStatus, setPublishStatus] = useState<'draft' | 'publish'>('draft');
  const [showInTicker, setShowInTicker] = useState(false);

  // Process state
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [pubError, setPubError] = useState<string | null>(null);

  // Result state
  const [post, setPost] = useState<GeneratedPost | null>(null);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [previewHtml, setPreviewHtml] = useState(false);
  const [copied, setCopied] = useState(false);

  // Unsplash state
  const [imageQuery, setImageQuery] = useState('');
  const [imageResults, setImageResults] = useState<UnsplashImage[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
  const [featuredMediaId, setFeaturedMediaId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Editable fields after generation
  const [editTitle, setEditTitle] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

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
  }, []);

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

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setGenError(null);
    setPost(null);
    setPublishResult(null);
    setSelectedImage(null);
    setFeaturedMediaId(null);
    setShowInTicker(false);
    setFaqs([]);

    try {
      const res = await fetch('/api/wp-blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone, length, keywords, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      const p: GeneratedPost = data.post;
      setPost(p);
      setEditTitle(p.title);
      setEditExcerpt(p.excerpt);
      setEditContent(p.content);
      setEditTags(p.tags.join(', '));
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
    <div className="min-h-screen bg-[#0a0a1a] text-white">
    <header className="border-b border-white/[0.07] bg-[#0d0d20]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">AI Blog Generator</h1>
            <p className="text-white/30 text-xs">Students in Germany — WordPress Publisher</p>
          </div>
        </div>
        <a
          href="http://localhost:8000/wp-admin"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          WP Admin
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </header>

    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
        {/* LEFT PANEL: Controls */}
        <div className="space-y-5">
          {/* Topic Input */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" />
              Blog Topic
            </h2>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How to apply for a student visa in Germany"
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all"
            />
            <div>
              <p className="text-white/30 text-xs mb-2">Quick ideas:</p>
              <div className="flex flex-wrap gap-1.5">
                {TOPIC_IDEAS.map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setTopic(idea)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white/70 hover:border-violet-500/30 transition-all text-left"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-pink-400" />
              Settings
            </h2>
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest">Category</label>
                <div className="relative mt-1">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 appearance-none"
                  >
                    {wpCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Add new category"
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/20"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="text-white/40 text-xs mb-1.5 block">Tone</label>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t} className="bg-[#1a1a2e]">{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>
              </div>

              {/* Length */}
              <div>
                <label className="text-white/40 text-xs mb-1.5 block">Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {LENGTHS.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setLength(l.value)}
                      className={`flex flex-col items-center py-2.5 rounded-xl border text-xs transition-all ${
                        length === l.value
                          ? 'border-violet-500/60 bg-violet-500/10 text-white'
                          : 'border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/20'
                      }`}
                    >
                      <span className="font-semibold">{l.label}</span>
                      <span className="text-[10px] opacity-60 mt-0.5">{l.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="text-white/40 text-xs mb-1.5 block">Keywords (optional)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="visa, Germany, student, 2025"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>
          </div>

          {/* FAQ Builder */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                FAQ Section
              </h2>
              <button
                type="button"
                onClick={handleAddFaq}
                className="text-xs font-semibold text-white bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20"
              >
                + Add FAQ
              </button>
            </div>
            {faqs.length === 0 && (
              <p className="text-white/40 text-sm">Add 2-3 questions your readers ask the most to boost SEO.</p>
            )}
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-white/[0.08] rounded-2xl p-3 bg-white/[0.01] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs text-white/40">Question</label>
                    {faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="text-[11px] text-white/40 hover:text-rose-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                    placeholder="What question are readers asking?"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
                  />
                  <label className="text-xs text-white/40">Answer</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                    placeholder="Answer in 2-3 concise sentences"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 resize-none"
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || generating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-violet-700 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Blog Post
              </>
            )}
          </button>

          {genError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {genError}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Preview & Publish */}
        <div className="space-y-5">
          {!post && !generating && (
            <div className="h-96 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/[0.07] rounded-2xl text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-violet-400/50" />
              </div>
              <p className="text-white/50 text-sm max-w-sm">
                Enter a topic on the left, configure your settings, then click &ldquo;Generate Blog Post&rdquo; to create AI-powered content.
              </p>
            </div>
          )}

          {generating && (
            <div className="h-96 flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.08] rounded-2xl text-center px-8">
              <Loader2 className="w-12 h-12 text-violet-400 animate-spin mb-4" />
              <p className="text-white font-semibold mb-2">Generating your blog post...</p>
              <p className="text-white/40 text-sm">This may take 10-20 seconds</p>
            </div>
          )}

          {post && (
            <>
              {/* Editable Title */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Pencil className="w-3.5 h-3.5" /> Title
                  </h2>
                  <button
                    onClick={handleGenerate}
                    className="text-[11px] text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-base font-semibold focus:outline-none focus:border-violet-500/50 transition-all"
                />
                <label className="text-white/30 text-xs block mt-3">SEO Excerpt</label>
                <input
                  type="text"
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white/70 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
                <label className="text-white/30 text-xs block mt-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white/70 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>

              {/* Featured Image */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Featured image (Unsplash)
              </h2>
              {selectedImage && (
                <button
                  onClick={() => { setSelectedImage(null); setFeaturedMediaId(null); }}
                  className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={imageQuery}
                    onChange={(e) => setImageQuery(e.target.value)}
                    placeholder="Search Unsplash for a photo..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-28 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
                  />
                  <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    onClick={() => handleUnsplashSearch()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20"
                  >
                    Search
                  </button>
                </div>
                {imageError && <p className="text-xs text-red-400 mt-2">{imageError}</p>}
                <p className="text-white/25 text-[11px] mt-2">Photos powered by Unsplash. We automatically credit the photographer.</p>
              </div>

              {selectedImage && (
                <div className="w-full md:w-52">
                  <img
                    src={selectedImage.urls.small}
                    alt={selectedImage.alt_description || ''}
                    className="w-full h-32 object-cover rounded-xl border border-white/10"
                  />
                  <p className="text-[11px] text-white/40 mt-2">
                    {selectedImage.user?.name ? `Photo by ${selectedImage.user.name}` : 'Unsplash photo'}
                  </p>
                </div>
              )}
            </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {imageLoading && (
                      <div className="col-span-full flex items-center justify-center py-6 text-white/40 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading photos…
                      </div>
                    )}
                    {!imageLoading && imageResults.length === 0 && (
                      <p className="col-span-full text-center text-white/30 text-sm">No photos yet. Try a different keyword.</p>
                    )}
                    {imageResults.map((img) => (
                      <button
                        type="button"
                        key={img.id}
                        onClick={() => { setSelectedImage(img); setFeaturedMediaId(null); }}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage?.id === img.id
                            ? 'border-violet-400 shadow-[0_0_0_2px_rgba(137,116,255,0.4)]'
                            : 'border-transparent hover:border-white/30'
                        }`}
                      >
                        <img src={img.urls.small} alt={img.alt_description || ''} className="w-full h-40 object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] px-2 py-1 text-left">
                          {img.user?.name || 'Unsplash'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content editor */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider">Content</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyContent}
                        className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/60 transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={() => setPreviewHtml(!previewHtml)}
                        className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/60 transition-colors"
                      >
                        {previewHtml ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {previewHtml ? 'Edit' : 'Preview'}
                      </button>
                    </div>
                  </div>

                  {previewHtml ? (
                    <div
                      className="prose-preview bg-white rounded-xl p-5 min-h-[300px] max-h-[520px] overflow-y-auto text-gray-800"
                      dangerouslySetInnerHTML={{ __html: editContent }}
                    />
                  ) : (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={16}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 text-sm font-mono focus:outline-none focus:border-violet-500/50 resize-y transition-all min-h-[300px]"
                    />
                  )}
                </div>

                {/* Publish controls */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Publish to WordPress
                    </h2>
                    {publishResult && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" /> Published
                      </span>
                    )}
                  </div>

                  {/* Draft vs Publish toggle */}
                  <div className="flex gap-2 mb-4">
                    {(['draft', 'publish'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setPublishStatus(s)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                          publishStatus === s
                            ? s === 'publish'
                              ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                              : 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                            : 'border-white/[0.07] text-white/30 hover:border-white/20'
                        }`}
                      >
                        {s === 'draft' ? '📝 Save as Draft' : '🚀 Publish Live'}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-start gap-3 mb-4 p-3 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                    <button
                      type="button"
                      onClick={() => setShowInTicker(!showInTicker)}
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        showInTicker ? 'bg-emerald-500/80' : 'bg-white/10'
                      }`}
                      role="switch"
                      aria-checked={showInTicker}
                    >
                      <span
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white transition-transform ${
                          showInTicker ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <div>
                      <p className="text-sm font-semibold text-white">Show in Updates ticker</p>
                      <p className="text-xs text-white/40">
                        Adds this article to the live homepage ticker. Ideal for breaking news and time-sensitive updates.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePublish}
                    disabled={publishing || uploadingImage || !editTitle || !editContent}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {publishing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing to WordPress…
                      </>
                    ) : uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading image…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {publishStatus === 'publish' ? 'Publish to WordPress' : 'Save as Draft'}
                      </>
                    )}
                  </button>

                  {pubError && (
                    <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{pubError}</span>
                    </div>
                  )}

                  {publishResult && (
                    <div className="mt-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <p className="text-emerald-300 text-sm font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {publishResult.status === 'publish' ? 'Published live!' : 'Saved as draft!'}
                      </p>
                      <div className="flex gap-3 mt-2">
                        <a
                          href={publishResult.postUrl}
                          target="_blank"
                          rel="noopener"
                          className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View post
                        </a>
                        <a
                          href={publishResult.editUrl}
                          target="_blank"
                          rel="noopener"
                          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit in WP Admin
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Prose preview styles */}
        <style jsx global>{`
          .prose-preview h2 { font-size: 1.25rem; font-weight: 700; margin: 1.5rem 0 0.5rem; color: #111; }
          .prose-preview h3 { font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.4rem; color: #222; }
          .prose-preview p { margin-bottom: 0.9rem; line-height: 1.7; color: #333; }
          .prose-preview ul, .prose-preview ol { margin: 0.5rem 0 1rem 1.5rem; }
          .prose-preview li { margin-bottom: 0.35rem; color: #333; }
          .prose-preview blockquote { border-left: 4px solid #ffce00; padding: 0.5rem 1rem; background: #fffbeb; border-radius: 0 6px 6px 0; font-style: italic; margin: 1rem 0; }
          .prose-preview strong { font-weight: 600; color: #111; }
          .prose-preview a { color: #dd0000; text-decoration: underline; }
        `}</style>
      </div>
    </div>
  );
}
