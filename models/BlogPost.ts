import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: string;
    status: 'draft' | 'published';
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true }, // Short summary for cards
    content: { type: String, required: true }, // Full HTML/Markdown content
    coverImage: { type: String, required: true },
    author: { type: String, required: true, default: 'Archer & Ash' },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    publishedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Auto-update updatedAt
// Auto-update updatedAt
BlogPostSchema.pre('save', async function (this: IBlogPost) {
    this.updatedAt = new Date();
    if (this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
});

// Auto-generate slug from title if not provided
BlogPostSchema.pre('validate', async function (this: IBlogPost) {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
});

const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
export default BlogPost;
