import Farm2 from "@/models/Farm2";
import connectMongo from "@/configs/mongoConfig";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectMongo();

    const { fullName, walletAddress, email, password } = await req.json();

    console.log('Received data:', { fullName, walletAddress, email, password });


    if (!fullName || !walletAddress || !email || !password) {
        return NextResponse.json({ message: 'Thiếu thông tin' }, { status: 400 });
    }

    console.log('Received data:', { fullName, walletAddress, email, password });
    try {
        const farm = new Farm2({
            fullName,
            walletAddress,
            email,
            password,
        });
        await farm.save();
        return NextResponse.json({ message: 'Tạo thành công' }, { status: 200 });
    } catch (error) {
        console.error('Lỗi khi tạo Farm:', error);
        return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 });
    }
}

// get farm2 by wallet address
export async function GET(req: Request) {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
        return NextResponse.json({ message: 'Thiếu thông tin' }, { status: 400 });
    }

    try {
        const farm = await Farm2.findOne({ walletAddress: walletAddress });
        console.log('Farm found:', farm);
        if (!farm) {
            return NextResponse.json({ message: 'Không tìm thấy' }, { status: 404 });
        }
        return NextResponse.json(farm, { status: 200 });
    } catch (error) {
        console.error('Lỗi khi lấy Farm:', error);
        return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 });
    }
}