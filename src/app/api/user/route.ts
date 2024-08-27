import { NextRequest, NextResponse } from "next/server";
import {
  withAuth,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";

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
