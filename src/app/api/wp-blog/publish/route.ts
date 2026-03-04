export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

type FAQItem = {
  question: string;
  answer: string;
};

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      content,
      excerpt,
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

    const wpUrl = process.env.WP_URL || 'http://localhost:8000';
    const wpUser = process.env.WP_USER || 'admin';
    const wpAppPassword = process.env.WP_APP_PASSWORD || '';

    if (!wpAppPassword) {
      return NextResponse.json(
        { error: 'WP_APP_PASSWORD not set in environment. Please add it to .env.local.' },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(`${wpUser}:${wpAppPassword}`).toString('base64');

    // Create/get tags first
    const tagIds: number[] = [];
    if (Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        try {
          const tagRes = await fetch(
            `${wpUrl}/wp-json/wp/v2/tags?search=${encodeURIComponent(tagName)}`,
            { headers: { Authorization: `Basic ${credentials}` } }
          );
          if (tagRes.ok) {
            const existing = await tagRes.json();
            if (existing.length > 0) {
              tagIds.push(existing[0].id);
            } else {
              const createRes = await fetch(`${wpUrl}/wp-json/wp/v2/tags`, {
                method: 'POST',
                headers: {
                  Authorization: `Basic ${credentials}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: tagName }),
              });
              if (createRes.ok) {
                const newTag = await createRes.json();
                tagIds.push(newTag.id);
              }
            }
          }
        } catch { /* skip tag errors */ }
      }
    }

    // Create/get category
    let categoryId: number | null = null;
    if (categoryName?.trim()) {
      const searchQuery = encodeURIComponent(categoryName.trim());
      try {
        const catRes = await fetch(
          `${wpUrl}/wp-json/wp/v2/categories?search=${searchQuery}`,
          { headers: { Authorization: `Basic ${credentials}` } }
        );
        if (catRes.ok) {
          const cats = await catRes.json();
          if (cats.length > 0) {
            categoryId = cats[0].id;
          } else {
            const slug = categoryName
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .slice(0, 32);
            const createCatRes = await fetch(`${wpUrl}/wp-json/wp/v2/categories`, {
              method: 'POST',
              headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: categoryName.trim(), slug }),
            });
            if (createCatRes.ok) {
              const newCat = await createCatRes.json();
              categoryId = newCat.id;
            }
          }
        }
      } catch (error) {
        console.warn('Category sync failed', error);
      }
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

    // Publish the post
    const postBody: Record<string, unknown> = {
      title,
      content: finalContent,
      excerpt: excerpt || '',
      status: status || 'draft',
      tags: tagIds,
    };

    if (slug) {
      postBody.slug = slug;
    }

    if (featuredMediaId) {
      postBody.featured_media = featuredMediaId;
    }

    if (categoryId) {
      postBody.categories = [categoryId];
    }

    if (typeof showInTicker === 'boolean') {
      postBody.meta = {
        sig_show_in_ticker: showInTicker,
      };
    }

    const postRes = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
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
      postId: post.id,
      postUrl: post.link,
      editUrl: `${wpUrl}/wp-admin/post.php?post=${post.id}&action=edit`,
      status: post.status,
    });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
