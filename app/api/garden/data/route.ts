import connectMongo from '../../../../configs/mongoConfig';
import TbService from '@/services/tb-service';

export async function GET(req: Request, res: Response) {
    await connectMongo();

    try {
        
        const { searchParams } = new URL(req.url);
        const gardenId = searchParams.get('gardenId');
        const startTs = searchParams.get('startTs');
        const endTs = searchParams.get('endTs');

        if (!gardenId) {
            return new Response(JSON.stringify({ message: 'Thiếu thông tin id vườn' }), { status: 400 });
        }

        const tbService = TbService.getInstance();
        const garden = await tbService.getAllDeviceDataByTime(gardenId, Number(startTs), Number(endTs));
        console.log('Garden data:', garden);

        if (!garden) {
            return new Response(JSON.stringify({ message: 'Không tìm thấy dữ liệu' }), { status: 404 });
        }

        return new Response(JSON.stringify(garden), { status: 200 });
    } catch (error) {
        console.error('Lỗi khi kiểm tra địa chỉ ví:', error);
        return new Response(JSON.stringify({ message: 'Lỗi máy chủ' }), { status: 500 });
    }
}