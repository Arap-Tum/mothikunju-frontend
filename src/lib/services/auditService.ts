import { apiClient } from '../api-client';
import {
  StockMovement,
  StockMovementResponse,
  StockMovementQuery,
  AuditResponse,
  InventoryAccuracyReport,
  CriticalItemsReport,
  AuditItem,
} from '@/types';

export const auditService = {
  /**
   * Get stock movement history with filters
   */
  getMovementHistory: async (params?: StockMovementQuery): Promise<StockMovementResponse> => {
    const response = await apiClient.get<StockMovementResponse>(
      '/audit/history/movements',
      { params }
    );
    return response.data!;
  },

  /**
   * Get stock movement for specific SKU
   */
  getMovementBySku: async (
    sku: string,
    limit?: number,
    skip?: number
  ): Promise<StockMovement[]> => {
    const response = await apiClient.get<StockMovement[]>(
      `/audit/history/${sku}`,
      { params: { limit, skip } }
    );
    return response.data || [];
  },

  /**
   * Conduct stock audit
   */
  conductAudit: async (skus: string[]): Promise<{ auditId: string; skus: string[] }> => {
    const response = await apiClient.post<{ auditId: string; skus: string[] }>(
      '/audit/audit/conduct',
      { skus }
    );
    return response.data!
  },

  /**
   * Submit audit results
   */
  submitAuditResults: async (auditItems: AuditItem[]): Promise<AuditResponse> => {
    const response = await apiClient.post<AuditResponse>(
      '/audit/audit/submit-results',
      { auditResults: auditItems }
    );
    return response.data!;
  },

  /**
   * Get inventory accuracy report
   */
  getAccuracyReport: async (): Promise<InventoryAccuracyReport> => {
    const response = await apiClient.get<InventoryAccuracyReport>(
      '/audit/reports/accuracy'
    );
    return response.data!;
  },

  /**
   * Get audit history
   */
  getAuditHistory: async (limit?: number, skip?: number): Promise<StockMovementResponse> => {
    const response = await apiClient.get<StockMovementResponse>(
      '/audit/reports/audit-history',
      { params: { limit, skip } }
    );
    return response.data!
  },

  /**
   * Get critical items (expired, expiring, low stock)
   */
  getCriticalItems: async (): Promise<CriticalItemsReport> => {
    const response = await apiClient.get<CriticalItemsReport>(
      '/audit/reports/critical-items'
    );
    return response.data!;
  },
};
