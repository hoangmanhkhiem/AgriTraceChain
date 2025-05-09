import { NextResponse } from "next/server";
import { generateNonce } from "@meshsdk/core";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const addressWallet = searchParams.get("addressWallet");

    if (!addressWallet) {
        return NextResponse.json({ error: "Thiếu addressWallet" }, { status: 400 });
    }

    try {
        const nonce = generateNonce("Sign to login in to Mesh: ");
        return NextResponse.json({ nonce });
    } catch (error) {
        console.error("Lỗi khi tạo nonce:", error);
        return NextResponse.json({ error: "Lỗi khi tạo nonce" }, { status: 500 });
    }
}
