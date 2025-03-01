/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnouncementAddRequest } from "../models/AnnouncementAddRequest";
import type { AnnouncementQueryRequest } from "../models/AnnouncementQueryRequest";
import type { AnnouncementUpdateRequest } from "../models/AnnouncementUpdateRequest";
import type { BaseResponse_Announcement_ } from "../models/BaseResponse_Announcement_";
import type { BaseResponse_boolean_ } from "../models/BaseResponse_boolean_";
import type { BaseResponse_Page_Announcement_ } from "../models/BaseResponse_Page_Announcement_";
import type { BaseResponse_Page_AnnouncementVO_ } from "../models/BaseResponse_Page_AnnouncementVO_";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class AnnouncementControllerService {
  /**
   * createAnnouncement
   * @param announcementAddRequest announcementAddRequest
   * @returns BaseResponse_Announcement_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static createAnnouncementUsingPost(
    announcementAddRequest: AnnouncementAddRequest
  ): CancelablePromise<BaseResponse_Announcement_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/announcement/add",
      body: announcementAddRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * deleteAnnouncement
   * @param id id
   * @returns BaseResponse_boolean_ OK
   * @throws ApiError
   */
  public static deleteAnnouncementUsingDelete(
    id: number
  ): CancelablePromise<BaseResponse_boolean_> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/announcement/delete/{id}",
      path: {
        id: id,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
      },
    });
  }

  /**
   * editAnnouncement
   * @param announcementUpdateRequest announcementUpdateRequest
   * @returns BaseResponse_Announcement_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static editAnnouncementUsingPost(
    announcementUpdateRequest: AnnouncementUpdateRequest
  ): CancelablePromise<BaseResponse_Announcement_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/announcement/edit",
      body: announcementUpdateRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * getAnnouncement
   * @param id id
   * @returns BaseResponse_Announcement_ OK
   * @throws ApiError
   */
  public static getAnnouncementUsingGet(
    id: number
  ): CancelablePromise<BaseResponse_Announcement_> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/announcement/get/{id}",
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
   * listAnnouncement
   * @param announcementQueryRequest announcementQueryRequest
   * @returns BaseResponse_Page_Announcement_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static listAnnouncementUsingPost(
    announcementQueryRequest: AnnouncementQueryRequest
  ): CancelablePromise<BaseResponse_Page_Announcement_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/announcement/list",
      body: announcementQueryRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * listAnnouncementForUser
   * @param announcementQueryRequest announcementQueryRequest
   * @returns BaseResponse_Page_AnnouncementVO_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static listAnnouncementForUserUsingPost(
    announcementQueryRequest: AnnouncementQueryRequest
  ): CancelablePromise<BaseResponse_Page_AnnouncementVO_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/announcement/list/user",
      body: announcementQueryRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * publishAnnouncement
   * @param id id
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static publishAnnouncementUsingPost(
    id?: number
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/announcement/publish",
      query: {
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
   * revokeAnnouncement
   * @param id id
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static revokeAnnouncementUsingPost(
    id?: number
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/announcement/revoke",
      query: {
        id: id,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
