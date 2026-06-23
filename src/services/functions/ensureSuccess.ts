// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ensureSuccess(res: any) {
  if (!res.data?.success) {
    // Ako je axios error, baci ga dalje da useAsyncAction može da izvuce poruku
    if (res instanceof Error) {
      throw res
    }
    throw new Error(res.data?.message || 'Request failed')
  }
}
