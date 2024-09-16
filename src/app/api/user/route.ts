import { NextRequest, NextResponse } from "next/server";
import {
  getKindeServerSession,
  withAuth,
} from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";

export const GET = withAuth(async (req: NextRequest, context: any) => {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");
  const search = searchParams.get("search");
  const skip = searchParams.get("skip");
  const limit = searchParams.get("limit");

  try {
    const userResponse = await axios.get(
      `${process.env.BACKEND_URL}/user?organizationId=${organizationId}&skip=${skip ?? ""}&limit=${limit ?? ""}&search=${search ?? ""}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return NextResponse.json(userResponse.data, { status: 200 });
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
  const { params } = context;
  console.log("params", params);
  const { getAccessTokenRaw, getUser } = getKindeServerSession();
  const currentUser = await getUser();
  const accessToken = await getAccessTokenRaw();
  const data = await req.json();

  try {
    const userResponse = await axios.post(
      `${process.env.BACKEND_URL}/user`,
      {
        ...data,
        id: currentUser?.id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(userResponse.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: false,
      },
      { status: 400 },
    );
  }
});
