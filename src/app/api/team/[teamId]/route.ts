import {
  getKindeServerSession,
  withAuth,
} from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    teamId: string;
  };
};

export const GET = withAuth(async (req: NextRequest, context: Context) => {
  const { params } = context;
  const teamId = params.teamId;
  const { getAccessTokenRaw, getUser } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();

  try {
    const teamResponse = await axios.get(
      `${process.env.BACKEND_URL}/team/${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(teamResponse.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
      },
      { status: 400 },
    );
  }
});

export const POST = withAuth(async (req: NextRequest, context: Context) => {
  const teamId = context.params.teamId;

  const body = await req.json();
  const { getAccessTokenRaw, getUser } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();

  try {
    const teamResponse = await axios.post(
      `${process.env.BACKEND_URL}/team/${teamId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(teamResponse.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
      },
      { status: 400 },
    );
  }
});
