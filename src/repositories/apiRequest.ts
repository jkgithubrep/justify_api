import { getRepository } from "typeorm";
import { ApiRequest, Token } from "../models";

export interface IApiRequestPayload {
  token: Token;
  size: number;
}

export const getTodayTotalRequestSizeByToken = async (
  token: Token
): Promise<number> => {
  const now = new Date();
  const currentDate =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  const { total } = await getRepository(ApiRequest)
    .createQueryBuilder("request")
    .select("SUM(request.size)", "total")
    .where("request.token = :token", { token: token.id })
    .andWhere("request.created_at::date = :now", { now: currentDate })
    .getRawOne();
  return parseInt(total) || 0;
};

export const createRequest = async ({
  token,
  size,
}: IApiRequestPayload): Promise<ApiRequest> => {
  const apiRequestRepository = getRepository(ApiRequest);
  const apiRequest = new ApiRequest();
  const data = {
    size: size,
    token: token,
  };
  return apiRequestRepository.save({
    ...apiRequest,
    ...data,
  });
};
