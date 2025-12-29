export interface CreatePasteRequest {
  content?: string;
  ttl_seconds?: number;
  max_views?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCreatePaste(body: CreatePasteRequest): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
    errors.push({ field: 'content', message: 'content is required and must be a non-empty string' });
  }

  if (body.ttl_seconds !== undefined) {
    if (typeof body.ttl_seconds !== 'number' || !Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
      errors.push({ field: 'ttl_seconds', message: 'ttl_seconds must be an integer >= 1' });
    }
  }

  if (body.max_views !== undefined) {
    if (typeof body.max_views !== 'number' || !Number.isInteger(body.max_views) || body.max_views < 1) {
      errors.push({ field: 'max_views', message: 'max_views must be an integer >= 1' });
    }
  }

  return errors;
}
