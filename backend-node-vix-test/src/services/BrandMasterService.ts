import { brandMaster, user } from "@prisma/client";
import { BrandMasterModel } from "../models/BrandMasterModel";
import { querySchema } from "../types/validations/Queries/queryListAll";
import {
  brandMasterSchema,
  TBrandMaster,
} from "../types/validations/BrandMaster/createBrandMaster";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import fs from "fs";
import path from "path";
import { API_VERSION } from "../constants/basePathRoutes";

export class BrandMasterService {
  constructor() {}
  private brandMasterModel = new BrandMasterModel();

  private async saveBase64Image(base64String: string): Promise<string> {
    if (
      !base64String ||
      typeof base64String !== "string" ||
      !base64String.startsWith("data:image")
    ) {
      return base64String;
    }

    try {
      const matches = base64String.match(
        /^data:image\/([a-zA-Z0-9]+);base64,(.+)$/,
      );

      if (!matches || matches.length !== 3) {
        return base64String;
      }

      const extension = matches[1];
      const data = matches[2];
      const buffer = Buffer.from(data, "base64");
      const uploadDir = path.resolve(__dirname, "..", "..", "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-logo.${extension}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.promises.writeFile(filePath, buffer);

      const baseUrl = process.env.BASE_URL_FILES || "http://localhost:3001";
      const apiVersion = API_VERSION?.MAIN || "/api/v1";

      return `${baseUrl}${apiVersion}/uploads/${fileName}`;
    } catch (error) {
      console.error("Erro ao processar imagem Base64:", error);
      throw new AppError(
        "Erro ao processar imagem de logo",
        STATUS_CODE.SERVER_ERROR,
      );
    }
  }

  async getSelf(domain: string) {
    return await this.brandMasterModel.getSelf(domain);
  }

  async getById(idBrandMaster: number) {
    return this.brandMasterModel.getById(idBrandMaster);
  }

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.brandMasterModel.listAll(validQuery);
  }

  async createNewBrandMaster(data: TBrandMaster, _user: user) {
    if (data.brandLogo) {
      data.brandLogo = await this.saveBase64Image(data.brandLogo);
    }

    const validData = brandMasterSchema.parse(data);

    if (validData.contract) {
      validData.contractAt = new Date();
    }

    if (validData.isPoc) {
      validData.pocOpenedAt = new Date();
    }

    return await this.brandMasterModel.createNewBrandMaster(validData);
  }

  private async update({
    validData,
    idBrandMaster,
  }: {
    validData: TBrandMaster;
    idBrandMaster: number;
    oldBrandMaster: brandMaster;
  }) {
    return await this.brandMasterModel.updateBrandMaster(
      idBrandMaster,
      validData,
    );
  }

  async updateBrandMaster(
    idBrandMaster: number,
    data: TBrandMaster,
    _user: user,
  ) {
    if (data.brandLogo) {
      data.brandLogo = await this.saveBase64Image(data.brandLogo);
    }

    const validData = brandMasterSchema.parse(data);
    const oldBrandMaster = await this.brandMasterModel.getById(idBrandMaster);

    if (!oldBrandMaster) {
      throw new AppError(
        ERROR_MESSAGE.BRAND_MASTER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    if (
      !oldBrandMaster.contract &&
      validData.contract &&
      !oldBrandMaster.contractAt
    ) {
      validData.contractAt = new Date();
    }

    if (
      validData.isPoc === true &&
      oldBrandMaster.isPoc !== true &&
      !oldBrandMaster.pocOpenedAt
    ) {
      validData.pocOpenedAt = new Date();
    }

    return this.update({
      validData,
      idBrandMaster,
      oldBrandMaster,
    });
  }

  async deleteBrandMaster(idBrandMaster: number, _user: user) {
    const oldBrandMaster = await this.brandMasterModel.getById(idBrandMaster);
    if (!oldBrandMaster) {
      throw new AppError(
        ERROR_MESSAGE.BRAND_MASTER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    const deletedBrand =
      await this.brandMasterModel.deleteBrandMaster(idBrandMaster);

    return {
      brandMaster: deletedBrand,
    };
  }
}
