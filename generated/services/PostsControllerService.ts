/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddPostRequest } from "../models/AddPostRequest";
import type { BaseResponse_boolean_ } from "../models/BaseResponse_boolean_";
import type { BaseResponse_long_ } from "../models/BaseResponse_long_";
import type { BaseResponse_Page_Posts_ } from "../models/BaseResponse_Page_Posts_";
import type { BaseResponse_Page_PostsVO_ } from "../models/BaseResponse_Page_PostsVO_";
import type { BaseResponse_Posts_ } from "../models/BaseResponse_Posts_";
import type { BaseResponse_PostsVO_ } from "../models/BaseResponse_PostsVO_";
import type { BaseResponse_string_ } from "../models/BaseResponse_string_";
import type { QueryPostRequest } from "../models/QueryPostRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class PostsControllerService {
  /**
   * checkPost
   * @param postId postId
   * @returns BaseResponse_string_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static checkPostUsingPut(
    postId: number
  ): CancelablePromise<BaseResponse_string_ | any> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/posts/check/{postId}",
      path: {
        postId: postId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * creatPost
   * @param addPostRequest addPostRequest
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static creatPostUsingPost(
    addPostRequest: AddPostRequest
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/posts/create",
      body: addPostRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * creatSolutionPost
   * @param addPostRequest addPostRequest
   * @returns BaseResponse_long_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static creatSolutionPostUsingPost(
    addPostRequest: AddPostRequest
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/posts/create/solution",
      body: addPostRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * deletePost
   * @param postId postId
   * @returns BaseResponse_boolean_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static deletePostUsingPut(
    postId: number
  ): CancelablePromise<BaseResponse_boolean_ | any> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/posts/delete/{postId}",
      path: {
        postId: postId,
      },
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * getAiAnswer
   * @param id id
   * @returns BaseResponse_string_ OK
   * @throws ApiError
   */
  public static getAiAnswerUsingGet(
    id: number
  ): CancelablePromise<BaseResponse_string_> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/posts/get/ai/answer/{id}",
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
   * getPostVOById
   * @param id id
   * @returns BaseResponse_PostsVO_ OK
   * @throws ApiError
   */
  public static getPostVoByIdUsingGet(
    id?: number
  ): CancelablePromise<BaseResponse_PostsVO_> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/posts/get/vo",
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
   * getPostById
   * @param id id
   * @returns BaseResponse_Posts_ OK
   * @throws ApiError
   */
  public static getPostByIdUsingGet(
    id: number
  ): CancelablePromise<BaseResponse_Posts_> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/posts/get/{id}",
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
   * listPosts
   * @param queryPostRequest queryPostRequest
   * @returns BaseResponse_Page_Posts_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static listPostsUsingPost(
    queryPostRequest: QueryPostRequest
  ): CancelablePromise<BaseResponse_Page_Posts_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/posts/list",
      body: queryPostRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * listSolutionPosts
   * @param queryPostRequest queryPostRequest
   * @returns BaseResponse_Page_PostsVO_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static listSolutionPostsUsingPost(
    queryPostRequest: QueryPostRequest
  ): CancelablePromise<BaseResponse_Page_PostsVO_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/posts/solution/list",
      body: queryPostRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  /**
   * listPostsByUser
   * @param queryPostRequest queryPostRequest
   * @returns BaseResponse_Page_PostsVO_ OK
   * @returns any Created
   * @throws ApiError
   */
  public static listPostsByUserUsingPost(
    queryPostRequest: QueryPostRequest
  ): CancelablePromise<BaseResponse_Page_PostsVO_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/posts/user/list/",
      body: queryPostRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
