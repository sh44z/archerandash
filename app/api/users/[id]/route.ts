import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// PATCH - Update a user's details (email and/or password)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const currentUser = token ? await verifyToken(token) : null;

        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { email, password } = await req.json();

        await dbConnect();

        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updateData: { email?: string; passwordHash?: string } = {};

        if (email && email !== userToUpdate.email) {
            if (!email.includes('@')) {
                return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
            }
            const lowercaseEmail = email.toLowerCase();
            const existing = await User.findOne({ email: lowercaseEmail });
            if (existing && existing._id.toString() !== id) {
                return NextResponse.json({ error: 'Email is already in use' }, { status: 400 });
            }
            updateData.email = lowercaseEmail;
        }

        if (password) {
            if (password.length < 6) {
                return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
            }
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, select: '-passwordHash' }
        );

        return NextResponse.json({
            success: true,
            user: updatedUser
        });
    } catch (error: any) {
        console.error('Failed to update user:', error);
        return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
    }
}

// DELETE - Delete a user
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const currentUser = token ? await verifyToken(token) : null;

        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Prevent deleting oneself
        if (currentUser.userId === id) {
            return NextResponse.json({ error: 'You cannot delete your own account while logged in' }, { status: 400 });
        }

        await dbConnect();

        // Prevent deleting the last user in the database
        const userCount = await User.countDocuments();
        if (userCount <= 1) {
            return NextResponse.json({ error: 'Cannot delete the last user in the database' }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
        console.error('Failed to delete user:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
    }
}
