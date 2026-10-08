/**
 * Minimal server-side validator mirroring SCHEMA.sql CHECK constraints.
 * Every accepted_attributes spec in api_routes/*.json is enforced here.
 */

export type FieldSpec =
  | { type: "string"; min_length?: number; max_length?: number; required?: boolean; format?: "email" }
  | { type: "number"; min?: number; max?: number; required?: boolean }
  | { type: "integer"; min?: number; max?: number; required?: boolean }
  | { type: "boolean"; required?: boolean }
  | { type: "enum"; values: string[]; required?: boolean }
  | { type: "array"; max_items?: number; item_min_length?: number; item_max_length?: number; required?: boolean };

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

export function validateFields(input: Record<string, unknown>, specs: Record<string, FieldSpec>): ValidationResult {
  const errors: Record<string, string> = {};
  for (const [key, spec] of Object.entries(specs)) {
    const raw = input[key];
    const required = spec.required === true;

    if (raw === undefined || raw === null || raw === "") {
      if (required) errors[key] = "required";
      continue;
    }

    switch (spec.type) {
      case "string": {
        if (typeof raw !== "string") { errors[key] = "must be a string"; break; }
        const s = raw as string;
        if (spec.format === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) errors[key] = "invalid email";
        if (spec.min_length !== undefined && s.length < spec.min_length) errors[key] = `min ${spec.min_length} chars`;
        if (spec.max_length !== undefined && s.length > spec.max_length) errors[key] = `max ${spec.max_length} chars`;
        break;
      }
      case "number": {
        const n = typeof raw === "number" ? raw : Number(raw);
        if (typeof raw === "string" && raw.trim() === "") break;
        if (!Number.isFinite(n)) { errors[key] = "must be a number"; break; }
        if (spec.min !== undefined && n < spec.min) errors[key] = `min ${spec.min}`;
        if (spec.max !== undefined && n > spec.max) errors[key] = `max ${spec.max}`;
        break;
      }
      case "integer": {
        const n = Number(raw);
        if (!Number.isInteger(n)) { errors[key] = "must be an integer"; break; }
        if (spec.min !== undefined && n < spec.min) errors[key] = `min ${spec.min}`;
        if (spec.max !== undefined && n > spec.max) errors[key] = `max ${spec.max}`;
        break;
      }
      case "boolean":
        if (typeof raw !== "boolean" && raw !== 0 && raw !== 1) errors[key] = "must be a boolean";
        break;
      case "enum":
        if (!spec.values.includes(raw as string)) errors[key] = `must be one of: ${spec.values.join(", ")}`;
        break;
      case "array": {
        if (!Array.isArray(raw)) { errors[key] = "must be an array"; break; }
        const arr = raw as unknown[];
        if (spec.max_items !== undefined && arr.length > spec.max_items) errors[key] = `max ${spec.max_items} items`;
        for (const item of arr) {
          if (typeof item !== "string") { errors[key] = "items must be strings"; break; }
          const s = item as string;
          if (spec.item_min_length !== undefined && s.length < spec.item_min_length) errors[key] = `items min ${spec.item_min_length} chars`;
          if (spec.item_max_length !== undefined && s.length > spec.item_max_length) errors[key] = `items max ${spec.item_max_length} chars`;
        }
        break;
      }
    }
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

/** Reject unknown keys not in the spec (zero-trust: no silent extra fields). */
export function pickAllowed<T extends Record<string, unknown>>(input: T, specs: Record<string, FieldSpec>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(specs)) {
    if (input[key] !== undefined) out[key] = input[key];
  }
  return out;
}
