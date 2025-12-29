import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventForm } from '@prisma/client';

/**
 * Form field types supported by the registration form builder
 * Validates: Requirements 9.1
 */
export enum FormFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  FILE = 'file',
  TEXTAREA = 'textarea',
  DATE = 'date',
}

/**
 * Form field definition
 * Validates: Requirements 9.1-9.4
 */
export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    fileTypes?: string[]; // For file uploads
    maxFileSize?: number; // In bytes
  };
  conditionalLogic?: {
    dependsOn: string; // Field ID
    showWhen: {
      operator: 'equals' | 'notEquals' | 'contains' | 'notContains';
      value: string | string[];
    };
  };
  order: number;
}

/**
 * Form schema (array of fields)
 */
export interface FormSchema {
  fields: FormField[];
  version: number;
}

/**
 * Form response (user's answers)
 */
export interface FormResponse {
  [fieldId: string]: string | number | boolean | string[];
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    fieldId: string;
    message: string;
  }>;
}

/**
 * FormService - Manages custom registration forms
 * Validates: Requirements 9.1-9.7
 */
@Injectable()
export class FormService {
  private readonly logger = new Logger(FormService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create or update form schema for an event
   * Validates: Requirements 9.1
   */
  async saveFormSchema(eventId: string, schema: FormSchema): Promise<EventForm> {
    // Validate schema
    this.validateSchema(schema);

    // Upsert form
    const form = await this.prisma.eventForm.upsert({
      where: { eventId },
      create: {
        eventId,
        schema: schema as any,
      },
      update: {
        schema: schema as any,
      },
    });

    this.logger.log(`FORM_SAVED: Form schema saved for event ${eventId}`);
    return form;
  }

  /**
   * Get form schema for an event
   */
  async getFormSchema(eventId: string): Promise<FormSchema | null> {
    const form = await this.prisma.eventForm.findUnique({
      where: { eventId },
    });

    if (!form) return null;
    return form.schema as unknown as FormSchema;
  }

  /**
   * Delete form schema for an event
   */
  async deleteFormSchema(eventId: string): Promise<void> {
    await this.prisma.eventForm.delete({
      where: { eventId },
    });
  }

  /**
   * Validate form schema structure
   */
  private validateSchema(schema: FormSchema): void {
    if (!schema.fields || !Array.isArray(schema.fields)) {
      throw new BadRequestException('Form schema must have a fields array');
    }

    const fieldIds = new Set<string>();

    for (const field of schema.fields) {
      // Check required properties
      if (!field.id || !field.type || !field.label) {
        throw new BadRequestException(
          'Each field must have id, type, and label',
        );
      }

      // Check for duplicate IDs
      if (fieldIds.has(field.id)) {
        throw new BadRequestException(`Duplicate field ID: ${field.id}`);
      }
      fieldIds.add(field.id);

      // Validate field type
      if (!Object.values(FormFieldType).includes(field.type)) {
        throw new BadRequestException(`Invalid field type: ${field.type}`);
      }

      // Validate options for select/radio/checkbox
      if (
        [FormFieldType.SELECT, FormFieldType.RADIO, FormFieldType.CHECKBOX].includes(
          field.type,
        )
      ) {
        if (!field.options || field.options.length === 0) {
          throw new BadRequestException(
            `Field ${field.id} requires options for type ${field.type}`,
          );
        }
      }

      // Validate conditional logic
      if (field.conditionalLogic) {
        if (!field.conditionalLogic.dependsOn) {
          throw new BadRequestException(
            `Field ${field.id} conditional logic must specify dependsOn`,
          );
        }
        // Check that dependsOn field exists
        const dependsOnExists = schema.fields.some(
          (f) => f.id === field.conditionalLogic!.dependsOn,
        );
        if (!dependsOnExists) {
          throw new BadRequestException(
            `Field ${field.id} depends on non-existent field ${field.conditionalLogic.dependsOn}`,
          );
        }
      }
    }
  }

  /**
   * Validate form responses against schema
   * Validates: Requirements 9.2
   */
  validateResponses(schema: FormSchema, responses: FormResponse): ValidationResult {
    const errors: Array<{ fieldId: string; message: string }> = [];

    for (const field of schema.fields) {
      const value = responses[field.id];

      // Check if field should be shown (conditional logic)
      if (field.conditionalLogic) {
        const dependsOnValue = responses[field.conditionalLogic.dependsOn];
        const shouldShow = this.evaluateCondition(
          field.conditionalLogic.showWhen,
          dependsOnValue,
        );
        if (!shouldShow) {
          continue; // Skip validation for hidden fields
        }
      }

      // Check required fields
      if (field.required && (value === undefined || value === null || value === '')) {
        errors.push({
          fieldId: field.id,
          message: `${field.label} is required`,
        });
        continue;
      }

      // Skip further validation if value is empty and not required
      if (value === undefined || value === null || value === '') {
        continue;
      }

      // Type-specific validation
      const typeError = this.validateFieldType(field, value);
      if (typeError) {
        errors.push({ fieldId: field.id, message: typeError });
        continue;
      }

      // Custom validation rules
      if (field.validation) {
        const validationError = this.validateFieldRules(field, value);
        if (validationError) {
          errors.push({ fieldId: field.id, message: validationError });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Evaluate conditional logic
   */
  private evaluateCondition(
    condition: NonNullable<FormField['conditionalLogic']>['showWhen'],
    value: any,
  ): boolean {
    const { operator, value: conditionValue } = condition;

    switch (operator) {
      case 'equals':
        return Array.isArray(conditionValue)
          ? conditionValue.includes(value)
          : value === conditionValue;
      case 'notEquals':
        return Array.isArray(conditionValue)
          ? !conditionValue.includes(value)
          : value !== conditionValue;
      case 'contains':
        if (typeof value !== 'string') return false;
        return Array.isArray(conditionValue)
          ? conditionValue.some((v) => value.includes(v))
          : value.includes(conditionValue as string);
      case 'notContains':
        if (typeof value !== 'string') return true;
        return Array.isArray(conditionValue)
          ? !conditionValue.some((v) => value.includes(v))
          : !value.includes(conditionValue as string);
      default:
        return true;
    }
  }

  /**
   * Validate field type
   */
  private validateFieldType(field: FormField, value: any): string | null {
    switch (field.type) {
      case FormFieldType.EMAIL:
        if (typeof value !== 'string' || !this.isValidEmail(value)) {
          return `${field.label} must be a valid email address`;
        }
        break;

      case FormFieldType.PHONE:
        if (typeof value !== 'string' || !this.isValidPhone(value)) {
          return `${field.label} must be a valid phone number`;
        }
        break;

      case FormFieldType.NUMBER:
        if (typeof value !== 'number' && isNaN(Number(value))) {
          return `${field.label} must be a number`;
        }
        break;

      case FormFieldType.SELECT:
      case FormFieldType.RADIO:
        if (!field.options?.includes(value as string)) {
          return `${field.label} must be one of the available options`;
        }
        break;

      case FormFieldType.CHECKBOX:
        if (!Array.isArray(value)) {
          return `${field.label} must be an array of selected options`;
        }
        for (const v of value) {
          if (!field.options?.includes(v)) {
            return `${field.label} contains invalid option: ${v}`;
          }
        }
        break;

      case FormFieldType.DATE:
        if (typeof value !== 'string' || isNaN(Date.parse(value))) {
          return `${field.label} must be a valid date`;
        }
        break;
    }

    return null;
  }

  /**
   * Validate field rules (min/max length, pattern, etc.)
   */
  private validateFieldRules(field: FormField, value: any): string | null {
    const { validation } = field;
    if (!validation) return null;

    // String length validation
    if (typeof value === 'string') {
      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`;
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} must be at most ${validation.maxLength} characters`;
      }
      if (validation.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          return `${field.label} format is invalid`;
        }
      }
    }

    // Number range validation
    if (field.type === FormFieldType.NUMBER) {
      const numValue = Number(value);
      if (validation.min !== undefined && numValue < validation.min) {
        return `${field.label} must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && numValue > validation.max) {
        return `${field.label} must be at most ${validation.max}`;
      }
    }

    return null;
  }

  /**
   * Simple email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Simple phone validation (allows various formats)
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-+()]{7,20}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Store form responses with registration
   * Validates: Requirements 9.5
   */
  async storeResponses(
    registrationId: string,
    responses: FormResponse,
  ): Promise<void> {
    await this.prisma.eventRegistration.update({
      where: { id: registrationId },
      data: {
        formResponses: responses as any,
      },
    });
  }

  /**
   * Get form responses for a registration
   * Validates: Requirements 9.6
   */
  async getResponses(registrationId: string): Promise<FormResponse | null> {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      select: { formResponses: true },
    });

    if (!registration) return null;
    return registration.formResponses as unknown as FormResponse;
  }

  /**
   * Get all form responses for an event (for export)
   * Validates: Requirements 9.7
   */
  async getAllResponses(eventId: string): Promise<
    Array<{
      registrationId: string;
      userId: string;
      userName: string;
      userEmail: string;
      responses: FormResponse;
    }>
  > {
    const registrations = await this.prisma.eventRegistration.findMany({
      where: {
        eventId,
        formResponses: { not: { equals: null } },
      },
      select: {
        id: true,
        userId: true,
        formResponses: true,
        user: {
          select: {
            email: true,
            profile: {
              select: { fullName: true },
            },
          },
        },
      },
    });

    return registrations.map((r) => ({
      registrationId: r.id,
      userId: r.userId,
      userName: r.user.profile?.fullName || 'Unknown',
      userEmail: r.user.email || '',
      responses: r.formResponses as unknown as FormResponse,
    }));
  }

  /**
   * Create default form schema with basic fields
   */
  createDefaultSchema(): FormSchema {
    return {
      version: 1,
      fields: [
        {
          id: 'name',
          type: FormFieldType.TEXT,
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          order: 1,
        },
        {
          id: 'email',
          type: FormFieldType.EMAIL,
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          order: 2,
        },
        {
          id: 'phone',
          type: FormFieldType.PHONE,
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: false,
          order: 3,
        },
      ],
    };
  }
}
