export interface UserReviewResponse {
  id: number;
  productId: number;
  accountName: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface UserReviewRequest {
  content: string;
  rating: number; // 1–5
}
