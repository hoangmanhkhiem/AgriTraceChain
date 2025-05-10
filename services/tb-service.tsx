
// tuong tac voi thingsboard api

import axios from "axios";

class TbService {
  private static instance: TbService;
  private baseUrl: string = '167.71.209.235:8080';
  private token: string | null = null;
  private refreshToken: string | null = null;
  private username = 'tenant@thingsboard.org';
  private password = 'tenant';

  private constructor() {}

  public static getInstance(): TbService {
    if (!TbService.instance) {
      TbService.instance = new TbService();
    }
    return TbService.instance;
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public async genToken(email: string, password: string): Promise<string> {
    const url = `http://${this.baseUrl}/api/auth/login`;
    const data = {
      username: email,
      password: password
    };
    try {
      const response = await axios.post(url, data);
      this.token = response.data.token;
      this.refreshToken = response.data.refreshToken;
      return response.data.token;
    } catch (error) {
      console.error("Error generating token:", error);
      return "";
    }
  }

    // lay danh sach cac vuon cua nguoi dung userId
    public async getGardenList(tbFarmerId: string) {
        const tbToken = await this.genToken(this.username, this.password); 
        const url = `http://${this.baseUrl}/api/customer/${tbFarmerId}/assets?pageSize=100&page=0`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Authorization': `Bearer ${tbToken}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching farm list:", error);
            throw new Error("Failed to fetch farm list");
        }
    }

    // lay danh sach cac Id thiet bi trong vuon
    public async getDeviceIdList(tbGardenId: string) {
        const tbToken = await this.genToken(this.username, this.password); 
        const url = `http://${this.baseUrl}/api/relations/info`;
        const params = {
            fromId: tbGardenId,
            fromType: "ASSET"
        };
        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Authorization': `Bearer ${tbToken}`
                },
                params: params
            });
            const deviceIdList = response.data.map((device: any) => device.to.id);
            console.log("Device ID list:", deviceIdList);
            return deviceIdList;
        } catch (error) {
            console.error("Error fetching device list:", error);
            throw new Error("Failed to fetch device list");
        }
    }

    // lay danh sach cac thiet bi theo danh sach Id thiet bi
    public async getDeviceList(deviceIdList: string[]) {
        const tbToken = await this.genToken(this.username, this.password); 
        const url = `http://${this.baseUrl}/api/devices?deviceIds=${deviceIdList.join(',')}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Authorization': `Bearer ${tbToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching device list:", error);
            throw new Error("Failed to fetch device list");
        }
    }

    // lay danh sach cac thiet bi trong vuon
    public async getDeviceListInGarden( tbGardenId: string) {
        try {
            const deviceIdList = await this.getDeviceIdList(tbGardenId);
            const deviceList = await this.getDeviceList(deviceIdList);
            return deviceList;
        } catch (error) {
            console.error("Error fetching device list:", error);
            throw new Error("Failed to fetch device list");
        }
    }

    // lay danh sach cac key cua thiet bi
    public async getDeviceKeys(tbDeviceId: string) {
        const tbToken = await this.genToken(this.username, this.password); 
        const url = `http://${this.baseUrl}/api/plugins/telemetry/DEVICE/${tbDeviceId}/keys/timeseries`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Authorization': `Bearer ${tbToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching device keys:", error);
            throw new Error("Failed to fetch device keys");
        }
    }

    // lay du lieu thiet bi theo key
    public async getDeviceData(tbDeviceId: string, tbKey: string) {
        const tbToken = await this.genToken(this.username, this.password); 
        const url = `http://${this.baseUrl}/api/plugins/telemetry/DEVICE/${tbDeviceId}/values/timeseries?keys=${tbKey}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Authorization': `Bearer ${tbToken}`
                }
            });
            console.log("Device data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching device data:", error);
            throw new Error("Failed to fetch device data");
        }
    }

    // lay du lieu thiet bi theo key va thoi gian
    public async getDeviceDataByTime(tbDeviceId: string, tbKey: string, startTime: number, endTime: number) {
        const tbToken = await this.genToken(this.username, this.password); 
        const url = `http://${this.baseUrl}/api/plugins/telemetry/DEVICE/${tbDeviceId}/values/timeseries?keys=${tbKey}&startTs=${startTime}&endTs=${endTime}`;
        console.log(url);
        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Authorization': `Bearer ${tbToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching device data by time:", error);
            throw new Error("Failed to fetch device data by time");
        }
    }

    // lay du lieuj tat ca cac thiet bi cua vuon theo id vuon, id nguoi dung, thoi gian bat dau, thoi gian ket thuc
    public async getAllDeviceDataByTime(tbGardenId: string, startTime: number, endTime: number) {
        try {
            const deviceIdList = await this.getDeviceIdList(tbGardenId);
            const deviceList = await this.getDeviceList(deviceIdList);
            const allDeviceData = [];
            for (const device of deviceList) {
                const deviceKeys = await this.getDeviceKeys(device.id.id);
                const deviceData: Record<string, any> = {};
                for (const key of deviceKeys) {
                    const data = await this.getDeviceDataByTime(device.id.id, key, startTime, endTime);
                    deviceData[key] = data;
                }
                allDeviceData.push({
                    deviceName: device.name,
                    data: deviceData
                });
            }
            return allDeviceData;
        } catch (error) {
            console.error("Error fetching all device data by time:", error);
            throw new Error("Failed to fetch all device data by time");
        }
    }

    // tao vuon moi
    public async createGarden(gardenName: string) {
        const tbToken = await this.genToken(this.username, this.password); 
        const url = `http://${this.baseUrl}/api/asset`;
        const data = { "name": gardenName };
        try {
            const response = await axios.post(url, data, {
                headers: {
                    'X-Authorization': `Bearer ${tbToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating garden:", error);
            throw new Error("Failed to create garden");
        }
    }

    // cap quyen cho nguoi dung su dung vuon
    public async grantGardenPermission(gardenId: string, userId: string) {
        const tbToken = await this.genToken(this.username, this.password); 
        const url = `http://${this.baseUrl}/api/customer/${userId}/asset/${gardenId}`;
        try {
            const response = await axios.post(url, {}, {
                headers: {
                    'X-Authorization': `Bearer ${tbToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error granting garden permission:", error);
            throw new Error("Failed to grant garden permission");
        }
    }

    // tao va cap quyen cho nguoi dung su dung vuon
    public async createAndGrantGardenPermission(gardenName: string, userId: string) {
        try {
            const garden = await this.createGarden(gardenName);
            const gardenId = garden.id.id;
            await this.grantGardenPermission(gardenId, userId);
            return garden;
        } catch (error) {
            console.error("Error creating and granting garden permission:", error);
            throw new Error("Failed to create and grant garden permission");
        }
    }

    // xoa vuon
    public async deleteGarden(gardenId: string) {
        const tbToken = await this.genToken(this.username, this.password); 
        const url = `http://${this.baseUrl}/api/customer/asset/${gardenId}`;
        try {
            const response = await axios.delete(url, {
                headers: {
                    'X-Authorization': `Bearer ${tbToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting garden:", error);
            throw new Error("Failed to delete garden");
        }
    }
} 

export default TbService;