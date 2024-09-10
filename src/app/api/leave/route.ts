import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import axios, { AxiosError } from "axios";

export const GET = withAuth(async (req: NextRequest, context: any) => {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  try {
    const leaveResponse = await axios.get(
      userId
        ? `${process.env.BACKEND_URL}/leave?userId=${userId}`
        : `${process.env.BACKEND_URL}/leave`,

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return NextResponse.json(leaveResponse.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
      },
      { status: 400 },
    );
  }
});

export const POST = withAuth(async (req: NextRequest, context: any) => {
  const body = await req.json();
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  console.log("EXECUTING LEAVE POST");
  console.log("body", body);
  console.log("userId", userId);
  try {
    const leaveResponse = await axios.post(
      `${process.env.BACKEND_URL}/leave?userId=${userId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return NextResponse.json(leaveResponse.data, { status: 200 });
  } catch (error: any) {
    console.log("ERROR from API", error.response.data.message);
    return NextResponse.json(error.response.data, { status: 400 });
  }
});
