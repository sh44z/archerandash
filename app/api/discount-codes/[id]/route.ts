import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DiscountCode from '@/models/DiscountCode';

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        await dbConnect();
        const deletedCode = await DiscountCode.findByIdAndDelete(params.id);
        
        if (!deletedCode) {
            return NextResponse.json({ error: 'Discount code not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Discount code deleted successfully' });
    } catch (error) {
        console.error('Error deleting discount code:', error);
        return NextResponse.json({ error: 'Failed to delete discount code' }, { status: 500 });
    }
}
