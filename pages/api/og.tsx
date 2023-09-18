import { ImageResponse, NextRequest } from "next/server";
import supabase from "./supabase";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hasID = searchParams.has("id");
    const id = hasID ? searchParams.get("id")?.slice(0, 100) : undefined;
    const { data } = await supabase.storage
      .from("ogp")
      .getPublicUrl(`${id}.png`);

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <img src={data.publicUrl}></img>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
