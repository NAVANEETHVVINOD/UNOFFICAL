"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Type,
  Hash,
  Mail,
  Phone,
  List,
  CircleDot,
  CheckSquare,
  FileUp,
  Settings2,
  Eye,
  EyeOff,
} from "lucide-react";

// Field types matching backend FormFieldType
export type FormFieldType =
  | "text"
  | "number"
  | "email"
  | "phone"
  | "select"
  | "radio"
  | "checkbox"
  | "file";

export interface ConditionalLogic {
  dependsOn: string;
  showWhen: {
    operator: "equals" | "notEquals" | "contains" | "notContains";
    value: string | string[];
  };
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    fileTypes?: string[];
    maxFileSize?: number;
  };
  conditionalLogic?: ConditionalLogic;
  order: number;
}

interface FormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const FIELD_TYPES: { type: FormFieldType; label: string; icon: React.ElementType }[] = [
  { type: "text", label: "Text", icon: Type },
  { type: "number", label: "Number", icon: Hash },
  { type: "email", label: "Email", icon: Mail },
  { type: "phone", label: "Phone", icon: Phone },
  { type: "select", label: "Dropdown", icon: List },
  { type: "radio", label: "Radio", icon: CircleDot },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "file", label: "File Upload", icon: FileUp },
];

const OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "notContains", label: "Not Contains" },
];

export default function FormBuilder({ fields, onChange }: FormBuilderProps) {
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = fields.findIndex((f) => f.id === active.id);
        const newIndex = fields.findIndex((f) => f.id === over.id);
        const newFields = arrayMove(fields, oldIndex, newIndex).map((f, i) => ({
          ...f,
          order: i + 1,
        }));
        onChange(newFields);
      }
    },
    [fields, onChange]
  );

  const addField = (type: FormFieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${FIELD_TYPES.find((t) => t.type === type)?.label || "Field"}`,
      required: false,
      order: fields.length + 1,
      options: ["select", "radio", "checkbox"].includes(type) ? ["Option 1", "Option 2"] : undefined,
    };
    onChange([...fields, newField]);
    setExpandedField(newField.id);
    setShowAddMenu(false);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    // Also remove any conditional logic that depends on this field
    const newFields = fields
      .filter((f) => f.id !== id)
      .map((f) => {
        if (f.conditionalLogic?.dependsOn === id) {
          const { conditionalLogic, ...rest } = f;
          return rest;
        }
        return f;
      })
      .map((f, i) => ({ ...f, order: i + 1 }));
    onChange(newFields);
    if (expandedField === id) setExpandedField(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedField(expandedField === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Field List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {fields.map((field) => (
              <SortableFieldItem
                key={field.id}
                field={field}
                allFields={fields}
                isExpanded={expandedField === field.id}
                onToggleExpand={() => toggleExpand(field.id)}
                onUpdate={(updates) => updateField(field.id, updates)}
                onRemove={() => removeField(field.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No custom fields yet. Add fields to collect additional information from attendees.
          </p>
        </div>
      )}

      {/* Add Field Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full p-3 border-2 border-dashed border-black dark:border-gray-600 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>

        {/* Field Type Menu */}
        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 shadow-neo dark:shadow-none z-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2">
              {FIELD_TYPES.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addField(type)}
                  className="flex flex-col items-center gap-1 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs font-bold dark:text-white">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showAddMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowAddMenu(false)} />
      )}
    </div>
  );
}


// Sortable Field Item Component
interface SortableFieldItemProps {
  field: FormField;
  allFields: FormField[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
}

function SortableFieldItem({
  field,
  allFields,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onRemove,
}: SortableFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const FieldIcon = FIELD_TYPES.find((t) => t.type === field.type)?.icon || Type;
  const hasConditionalLogic = !!field.conditionalLogic;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      {/* Field Header */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        <FieldIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />

        <span className="flex-1 font-bold text-sm dark:text-white truncate">
          {field.label}
        </span>

        {hasConditionalLogic && (
          <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
            Conditional
          </span>
        )}

        {field.required && (
          <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
            Required
          </span>
        )}

        <button
          type="button"
          onClick={onToggleExpand}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
          aria-label="Remove field"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Field Settings (Expanded) */}
      {isExpanded && (
        <FieldSettings field={field} allFields={allFields} onUpdate={onUpdate} />
      )}
    </div>
  );
}

// Field Settings Component
interface FieldSettingsProps {
  field: FormField;
  allFields: FormField[];
  onUpdate: (updates: Partial<FormField>) => void;
}

function FieldSettings({ field, allFields, onUpdate }: FieldSettingsProps) {
  const [showConditionalLogic, setShowConditionalLogic] = useState(!!field.conditionalLogic);
  const needsOptions = ["select", "radio", "checkbox"].includes(field.type);

  const otherFields = allFields.filter((f) => f.id !== field.id);

  const addOption = () => {
    const options = field.options || [];
    onUpdate({ options: [...options, `Option ${options.length + 1}`] });
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(field.options || [])];
    options[index] = value;
    onUpdate({ options });
  };

  const removeOption = (index: number) => {
    const options = (field.options || []).filter((_, i) => i !== index);
    onUpdate({ options });
  };

  const toggleConditionalLogic = () => {
    if (showConditionalLogic) {
      onUpdate({ conditionalLogic: undefined });
      setShowConditionalLogic(false);
    } else {
      setShowConditionalLogic(true);
    }
  };

  const updateConditionalLogic = (updates: Partial<ConditionalLogic>) => {
    const current = field.conditionalLogic || {
      dependsOn: "",
      showWhen: { operator: "equals" as const, value: "" },
    };
    onUpdate({
      conditionalLogic: { ...current, ...updates },
    });
  };

  return (
    <div className="p-4 space-y-4 border-t-2 border-gray-200 dark:border-gray-700">
      {/* Basic Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1 dark:text-white">
            Field Label *
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full p-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono text-sm"
            placeholder="Enter field label"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1 dark:text-white">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value || undefined })}
            className="w-full p-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono text-sm"
            placeholder="Enter placeholder text"
          />
        </div>
      </div>

      {/* Required Toggle */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="w-4 h-4 border-2 border-black"
          />
          <span className="text-sm font-bold dark:text-white">Required field</span>
        </label>
      </div>

      {/* Options for select/radio/checkbox */}
      {needsOptions && (
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-white">
            Options
          </label>
          <div className="space-y-2">
            {(field.options || []).map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 p-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono text-sm"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  disabled={(field.options?.length || 0) <= 1}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Add Option
            </button>
          </div>
        </div>
      )}

      {/* Conditional Logic */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={toggleConditionalLogic}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          <Settings2 className="w-4 h-4" />
          {showConditionalLogic ? "Remove Conditional Logic" : "Add Conditional Logic"}
          {showConditionalLogic ? (
            <EyeOff className="w-4 h-4 ml-auto" />
          ) : (
            <Eye className="w-4 h-4 ml-auto" />
          )}
        </button>

        {showConditionalLogic && otherFields.length > 0 && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 space-y-3">
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Show this field only when another field meets a condition
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-purple-800 dark:text-purple-200">
                  When field
                </label>
                <select
                  value={field.conditionalLogic?.dependsOn || ""}
                  onChange={(e) => updateConditionalLogic({ dependsOn: e.target.value })}
                  className="w-full p-2 border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900 dark:text-white text-sm"
                >
                  <option value="">Select field...</option>
                  {otherFields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-purple-800 dark:text-purple-200">
                  Condition
                </label>
                <select
                  value={field.conditionalLogic?.showWhen.operator || "equals"}
                  onChange={(e) =>
                    updateConditionalLogic({
                      showWhen: {
                        ...field.conditionalLogic?.showWhen,
                        operator: e.target.value as ConditionalLogic["showWhen"]["operator"],
                        value: field.conditionalLogic?.showWhen.value || "",
                      },
                    })
                  }
                  className="w-full p-2 border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900 dark:text-white text-sm"
                >
                  {OPERATORS.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-purple-800 dark:text-purple-200">
                  Value
                </label>
                <ConditionalValueInput
                  dependsOnField={otherFields.find((f) => f.id === field.conditionalLogic?.dependsOn)}
                  value={field.conditionalLogic?.showWhen.value || ""}
                  onChange={(value) =>
                    updateConditionalLogic({
                      showWhen: {
                        operator: field.conditionalLogic?.showWhen.operator || "equals",
                        value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {showConditionalLogic && otherFields.length === 0 && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Add more fields to enable conditional logic
          </p>
        )}
      </div>
    </div>
  );
}

// Conditional Value Input - shows dropdown for select/radio fields
interface ConditionalValueInputProps {
  dependsOnField?: FormField;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

function ConditionalValueInput({ dependsOnField, value, onChange }: ConditionalValueInputProps) {
  const hasOptions = dependsOnField && ["select", "radio", "checkbox"].includes(dependsOnField.type);

  if (hasOptions && dependsOnField.options) {
    return (
      <select
        value={typeof value === "string" ? value : value[0] || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900 dark:text-white text-sm"
      >
        <option value="">Select value...</option>
        {dependsOnField.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      value={typeof value === "string" ? value : value.join(", ")}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900 dark:text-white text-sm"
      placeholder="Enter value..."
    />
  );
}
