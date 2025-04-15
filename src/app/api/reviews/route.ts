import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import Review from '@/models/Review';

export async function GET() {
  await connect();
  try {
    const reviews = await Review.find().populate('client_id').populate('lawyer_id').populate('consultation_id');
    return NextResponse.json(reviews);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req:NextRequest) {
  await connect();
  const body = await req.json();
  try {
    const review = new Review(body);
    await review.save();
    return NextResponse.json(review, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}