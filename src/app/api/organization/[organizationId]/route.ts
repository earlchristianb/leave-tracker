import {
  getKindeServerSession,
  withAuth,
} from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    organizationId: string;
  };
};

export const GET = withAuth(async (req: NextRequest, context: Context) => {
  const { params } = context;
  const organizationId = params.organizationId;
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();

  try {
    const teamResponse = await axios.get(
      `${process.env.BACKEND_URL}/organization?organizationId=${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(teamResponse.data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: true }, { status: 400 });
  }
});

export const POST = withAuth(async (req: NextRequest, context: Context) => {
  const body = await req.json();
  const { getAccessTokenRaw, getUser } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();
  const getCurrentUser = await getUser();
  console.log("EXECUTING JOIN POST");
  console.log("body", body);
  try {
    const teamResponse = await axios.post(
      `${process.env.BACKEND_URL}/organization/join`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(teamResponse.data, { status: 200 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: true }, { status: 400 });
  }
});
