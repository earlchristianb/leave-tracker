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
    const organizationResponse = await axios.get(
      `${process.env.BACKEND_URL}/organization/${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log("organizationResponse", organizationResponse.data);

    return NextResponse.json(organizationResponse.data, { status: 200 });
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
    const organizationResponse = await axios.post(
      `${process.env.BACKEND_URL}/organization/join`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(organizationResponse.data, { status: 200 });
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json(error.response.data, { status: 400 });
  }
});

export const PATCH = withAuth(async (req: NextRequest, context: Context) => {
  const { params } = context;
  const organizationId = params.organizationId;
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();
  const body = await req.json();
  try {
    const organizationResponse = await axios.patch(
      `${process.env.BACKEND_URL}/organization/${organizationId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log("organizationResponse", organizationResponse.data);
    return NextResponse.json(organizationResponse.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.response.data, { status: 400 });
  }
});
