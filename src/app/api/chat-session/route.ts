import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import ChatSessions from '@/models/ChatSessions';

export async function GET() {
  await connect();
  try {
    const sessions = await ChatSessions.find().populate('client_id').populate('lawyer_id');
    return NextResponse.json(sessions);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req:NextRequest) {
  await connect();
  const body = await req.json();
  try {
    const session = new ChatSessions(body);
    await session.save();
    return NextResponse.json(session, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}