import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";

export const GET = withAuth(async (req: NextRequest, context: any) => {
  const { params } = context;
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();

  try {
    const userResponse = await axios.get(
      `${process.env.BACKEND_URL}/user/${params.userId}`,
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
        error: false,
      },
      { status: 400 },
    );
  }
});
