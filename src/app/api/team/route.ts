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

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");
  console.log("organizationId", organizationId);
  const { getAccessTokenRaw, getUser } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();

  try {
    const teamResponse = await axios.get(
      `${process.env.BACKEND_URL}/team?organizationId=${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(teamResponse.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.response.data, { status: 400 });
  }
});

export const POST = withAuth(async (req: NextRequest, context: Context) => {
  const body = await req.json();
  const { getAccessTokenRaw, getUser } = getKindeServerSession();
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");
  const accessToken = await getAccessTokenRaw();

  try {
    const teamResponse = await axios.post(
      `${process.env.BACKEND_URL}/team`,
      {
        ...body,
        organizationId: organizationId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return NextResponse.json(teamResponse.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.response.data, { status: 400 });
  }
});
