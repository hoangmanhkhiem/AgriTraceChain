import Farm from '../../../models/Farm';  
import Logistics from '../../../models/Logistics';
import Product from '../../../models/Product';
import Store from '../../../models/Store';
import connectMongo from '../../../configs/mongoConfig';

export async function GET(req: Request, res: Response) {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const addressWallet = searchParams.get("addressWallet");

    if (!addressWallet) {
        return new Response(JSON.stringify({ message: 'Thiếu addressWallet' }), { status: 400 });
    }

    try {
        const farm = await Farm.findOne({ addressWallet })
        const logistics = await Logistics.findOne({ addressWallet });
        const product = await Product.findOne({ addressWallet });
        const store = await Store.findOne({ addressWallet });

        if (farm || logistics || product || store) {
           if(farm) {
                return new Response(JSON.stringify({ role: 0, message: 'Địa chỉ ví đã tồn tại trong bảng Farm' }), { status: 200 });
            }
            if(logistics) {
                return new Response(JSON.stringify({ role: 1, message: 'Địa chỉ ví đã tồn tại trong bảng Logistics' }), { status: 200 });
            }
            if(product) {
                return new Response(JSON.stringify({ role: 2, message: 'Địa chỉ ví đã tồn tại trong bảng Product' }), { status: 200 });
            }
            if(store) {
                return new Response(JSON.stringify({ role: 3, message: 'Địa chỉ ví đã tồn tại trong bảng Store' }), { status: 200 });
            }
        } else {
            return new Response(JSON.stringify({ message: 'Địa chỉ ví hợp lệ' }), { status: 200 });
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra địa chỉ ví:', error);
        return new Response(JSON.stringify({ message: 'Lỗi máy chủ' }), { status: 500 });
    }
}