import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
type Context = {
  params: {
    organizationId: string;
  };
};
export const GET = withAuth(async (req: NextRequest, context: Context) => {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();
  const organizationId = context.params.organizationId;
  try {
    const orgLeaveResponse = await axios.get(
      `${process.env.BACKEND_URL}/organization/${organizationId}/leave`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return NextResponse.json(orgLeaveResponse.data, { status: 200 });
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
  const organizationId = context.params.organizationId;
  try {
    const orgLeaveResponse = await axios.post(
      `${process.env.BACKEND_URL}/organization/${organizationId}/leave`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(orgLeaveResponse.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
      },
      { status: 400 },
    );
  }
});
