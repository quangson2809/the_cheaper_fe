import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { UserReviewResponse, UserReviewRequest } from '@/types/review.types';

export async function getReviews(productId: number): Promise<ApiResponse<UserReviewResponse[]>> {
  const res = await axiosClient.get<ApiResponse<UserReviewResponse[]>>(EP.PRODUCT_REVIEWS(productId));
  return res.data;
}

export async function createReview(productId: number, data: UserReviewRequest): Promise<ApiResponse<UserReviewResponse>> {
  const res = await axiosClient.post<ApiResponse<UserReviewResponse>>(EP.PRODUCT_REVIEWS(productId), data);
  return res.data;
}
