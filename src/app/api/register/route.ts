import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, Registration } from '@/lib/supabase';
import { transporter, createConfirmationEmail } from '@/lib/email';

// Define validation schema
const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const result = registrationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email } = result.data;

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('registration')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Insert into Supabase with only the existing fields
    const { data, error } = await supabase
      .from('registration')
      .insert([{
        name,
        email
        // Note: The reminder fields will be added to the database schema later
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to register' },
        { status: 500 }
      );
    }

    // Send confirmation email with calendar attachment
    try {
      await transporter.sendMail(await createConfirmationEmail(name, email));
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // We still return success even if email fails, but log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
