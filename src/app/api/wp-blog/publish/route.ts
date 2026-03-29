export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

type FAQItem = {
  question: string;
  answer: string;
};

export async function POST(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireAdminApi();
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

	    const {
	      title,
	      content,
	      excerpt,
	      seoTitle,
	      metaDescription,
	      canonicalUrl,
	      tags,
	      status,
	      slug,
	      featuredMediaId,
      categoryName,
      showInTicker,
      faqs,
    } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const wpUrl = process.env.WP_URL || 'https://cms.germanpath.com';
    const wpCustomApiToken = process.env.WP_CUSTOM_API_TOKEN || '';

    if (!wpCustomApiToken) {
      return NextResponse.json(
        { error: 'WP_CUSTOM_API_TOKEN not set in environment. Please add it to .env.local.' },
        { status: 500 }
      );
    }

    const sanitizedFaqs: FAQItem[] = Array.isArray(faqs)
      ? faqs
          .map((faq: FAQItem) => ({
            question: faq?.question?.trim() || '',
            answer: faq?.answer?.trim() || '',
          }))
          .filter((faq) => faq.question && faq.answer)
          .slice(0, 5)
      : [];

	    const faqSection = sanitizedFaqs.length
      ? `\n<section class="sig-faqs">\n  <h2>Frequently Asked Questions</h2>\n  <div class="sig-faqs__items">\n    ${sanitizedFaqs
        .map((faq, idx) => {
          const safeQuestion = faq.question.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const safeAnswer = faq.answer.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const openClass = idx === 0 ? ' open' : '';
          return `<article class="sig-faq${openClass}">\n              <h3>${safeQuestion}</h3>\n              <div class="sig-faq__answer">\n                <p>${safeAnswer}</p>\n              </div>\n            </article>`;
        })
        .join('\n')}\n  </div>\n</section>`
      : '';

	    const finalContent = `${content}${faqSection}`;
	    const normalizedSeoTitle =
	      typeof seoTitle === 'string' && seoTitle.trim() ? seoTitle.trim() : '';
	    const normalizedMetaDescription =
	      typeof metaDescription === 'string' && metaDescription.trim() ? metaDescription.trim() : '';
	    const normalizedCanonicalUrl =
	      typeof canonicalUrl === 'string' && canonicalUrl.trim() ? canonicalUrl.trim() : '';

	    const postBody: Record<string, unknown> = {
	      api_token: wpCustomApiToken,
	      title,
      content: finalContent,
      excerpt: excerpt || '',
      status: status || 'draft',
	      tags: Array.isArray(tags) ? tags : [],
	    };

	    if (normalizedSeoTitle) {
	      postBody.seo_title = normalizedSeoTitle;
	    }

	    if (normalizedMetaDescription) {
	      postBody.meta_description = normalizedMetaDescription;
	    }

	    if (normalizedCanonicalUrl) {
	      postBody.canonical_url = normalizedCanonicalUrl;
	    }

	    if (normalizedSeoTitle || normalizedMetaDescription || normalizedCanonicalUrl) {
	      postBody.seo = {
	        title: normalizedSeoTitle || undefined,
	        description: normalizedMetaDescription || undefined,
	        canonical_url: normalizedCanonicalUrl || undefined,
	      };
	      postBody.meta = {
	        germanpath_seo_title: normalizedSeoTitle || undefined,
	        germanpath_meta_description: normalizedMetaDescription || undefined,
	        germanpath_canonical_url: normalizedCanonicalUrl || undefined,
	      };
	    }

    if (slug) {
      postBody.slug = slug;
    }

    if (featuredMediaId) {
      postBody.featured_media = Number(featuredMediaId);
    }

    if (categoryName?.trim()) {
      postBody.categories = [categoryName.trim()];
    }

    if (typeof showInTicker === 'boolean') {
      postBody.show_in_ticker = showInTicker;
    }

    const postRes = await fetch(`${wpUrl}/wp-json/custom/v1/create-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    });

    if (!postRes.ok) {
      const err = await postRes.text();
      console.error('WordPress publish error:', err);
      return NextResponse.json(
        { error: `WordPress returned ${postRes.status}: ${err}` },
        { status: 502 }
      );
    }

    const post = await postRes.json();

    return NextResponse.json({
      success: true,
      postId: post.post_id,
      postUrl: post.link,
      editUrl: `${wpUrl}/wp-admin/post.php?post=${post.post_id}&action=edit`,
      status: status || 'draft',
    });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
