import { jsonResponse } from '@/lib/api-helpers';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return jsonResponse({ data: { id, deleted: true } });
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return jsonResponse({ data: { id, rotated: true, new_key: `sk-recall-${crypto.randomUUID()}` } });
}
