import jwt from "jsonwebtoken";
import { checkSignature } from "@meshsdk/core";

const JWT_SECRET = 'your_jwt_secret'; // Thay thế bằng bí mật JWT của bạn

export async function POST(req: Request): Promise<Response> {
    const body = await req.json();
    const { addressWallet, signature, nonce } = body;

    console.log('addressWallet:', addressWallet);
    console.log('signature:', signature);
    console.log('nonce:', nonce);

    if (!addressWallet || !signature || !nonce) {
        return new Response(JSON.stringify({ error: 'Thiếu addressWallet, chữ ký hoặc nonce' }), { status: 400 });
    }

    try {
        // Xác thực chữ ký với hàm verifyMessage
        const isValid = checkSignature(nonce, signature, addressWallet);

        if (!isValid) {
            return new Response(JSON.stringify({ error: 'Chữ ký không hợp lệ' }), { status: 400 });
        }

        // Nếu xác thực thành công, tạo JWT
        const accessToken = jwt.sign({ addressWallet }, JWT_SECRET, { expiresIn: '1h' });

        return new Response(JSON.stringify({ accessToken }), { status: 200 });
    } catch (error) {
        console.error('Lỗi khi xác thực chữ ký:', error);
        return new Response(JSON.stringify({ error: 'Lỗi máy chủ' }), { status: 500 });
    }
}