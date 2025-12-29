"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Clock, Calendar, ChevronDown, ChevronUp, GripVertical } from "lucide-react";

interface AgendaBlock {
  id: string;
  day: number;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}

interface AgendaEditorProps {
  agendaBlocks: AgendaBlock[];
  eventStartDate: string;
  eventEndDate: string;
  onChange: (blocks: AgendaBlock[]) => void;
}

export default function AgendaEditor({
  agendaBlocks,
  eventStartDate,
  eventEndDate,
  onChange,
}: AgendaEditorProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Calculate number of days between start and end
  const getEventDays = (): { day: number; date: string }[] => {
    if (!eventStartDate || !eventEndDate) return [];
    
    const start = new Date(eventStartDate);
    const end = new Date(eventEndDate);
    const days: { day: number; date: string }[] = [];
    
    let current = new Date(start);
    let dayNum = 1;
    
    while (current <= end) {
      days.push({
        day: dayNum,
        date: current.toISOString().split("T")[0],
      });
      current.setDate(current.getDate() + 1);
      dayNum++;
    }
    
    return days;
  };

  const eventDays = getEventDays();
  const isMultiDay = eventDays.length > 1;

  const addBlock = (day: number, date: string) => {
    const newBlock: AgendaBlock = {
      id: Date.now().toString(),
      day,
      date,
      startTime: "09:00",
      endTime: "10:00",
      title: "",
      description: "",
    };
    onChange([...agendaBlocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<AgendaBlock>) => {
    onChange(
      agendaBlocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  };

  const removeBlock = (id: string) => {
    onChange(agendaBlocks.filter((block) => block.id !== id));
  };

  const getBlocksForDay = (day: number) => {
    return agendaBlocks
      .filter((block) => block.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  if (!isMultiDay && eventDays.length === 0) {
    return (
      <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Set event start and end dates to add agenda items
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold dark:text-white">Event Agenda</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {isMultiDay 
              ? `${eventDays.length}-day event - Add sessions for each day`
              : "Add sessions and activities for your event"
            }
          </p>
        </div>
      </div>

      {eventDays.map(({ day, date }) => {
        const dayBlocks = getBlocksForDay(day);
        const isExpanded = expandedDay === day;
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return (
          <div
            key={day}
            className="border-2 border-ink dark:border-neutral-700 rounded-lg overflow-hidden"
          >
            {/* Day Header */}
            <button
              onClick={() => setExpandedDay(isExpanded ? null : day)}
              className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-ink">
                  {day}
                </div>
                <div className="text-left">
                  <p className="font-bold dark:text-white">
                    {isMultiDay ? `Day ${day}` : "Schedule"}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formattedDate} • {dayBlocks.length} session{dayBlocks.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-neutral-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-500" />
              )}
            </button>

            {/* Day Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3 border-t dark:border-neutral-700">
                    {dayBlocks.map((block, index) => (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                      >
                        <div className="flex-shrink-0 pt-2">
                          <GripVertical className="w-4 h-4 text-neutral-400 cursor-grab" />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          {/* Time Row */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-neutral-400" />
                            <input
                              type="time"
                              value={block.startTime}
                              onChange={(e) => updateBlock(block.id, { startTime: e.target.value })}
                              className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 dark:text-white text-sm font-mono"
                            />
                            <span className="text-neutral-400">to</span>
                            <input
                              type="time"
                              value={block.endTime}
                              onChange={(e) => updateBlock(block.id, { endTime: e.target.value })}
                              className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 dark:text-white text-sm font-mono"
                            />
                          </div>
                          
                          {/* Title */}
                          <input
                            type="text"
                            value={block.title}
                            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                            placeholder="Session title"
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 dark:text-white text-sm"
                          />
                          
                          {/* Description */}
                          <textarea
                            value={block.description}
                            onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                            placeholder="Description (optional)"
                            rows={2}
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 dark:text-white text-sm resize-none"
                          />
                        </div>
                        
                        <button
                          onClick={() => removeBlock(block.id)}
                          className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}

                    {/* Add Block Button */}
                    <button
                      onClick={() => addBlock(day, date)}
                      className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-500 dark:text-neutral-400 hover:border-primary hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}