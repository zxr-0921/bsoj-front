/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AIGenerateQuestionRequest } from "../models/AIGenerateQuestionRequest";
import type { AIQuestionAnalysisRequest } from "../models/AIQuestionAnalysisRequest";
import type { BaseResponse_string_ } from "../models/BaseResponse_string_";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class AiControllerService {
  /**
   * answer
   * @param id id
   * @returns BaseResponse_string_ OK
   * @throws ApiError
   */
  public static answerUsingGet(
    id: string
  ): CancelablePromise<BaseResponse_string_> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/ai/answer/{id}",
      path: {
        id: id,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * codeOptimize
   * @param code code
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static codeOptimizeUsingPost(
    code?: string
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/ai/code/optimize",
      query: {
        code: code,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * generateQuestion
   * @param request request
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static generateQuestionUsingPost(
    request: AIGenerateQuestionRequest
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/ai/generate/question",
      body: request,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * getAnswer
   * @param question question
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static getAnswerUsingPost(
    question: AIQuestionAnalysisRequest
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/ai/question/analysis",
      body: question,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
