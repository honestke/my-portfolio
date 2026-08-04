"use client";

import { useState } from "react";
import type { Skill } from "@/lib/types";
import { createSkill, updateSkill, deleteSkill, toggleSkillPublish } from "../actions";

const inputClass =
  "rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500";

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div>
      <form
        action={createSkill}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-400">Name</label>
          <input name="name" type="text" required placeholder="Python" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-400">Category</label>
          <input name="category" type="text" placeholder="Programming" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-400">Proficiency (0-100)</label>
          <input
            name="proficiency"
            type="number"
            min={0}
            max={100}
            defaultValue={80}
            className={`${inputClass} w-24`}
          />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm text-neutral-300">
          <input type="checkbox" name="published" defaultChecked />
          Published
        </label>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Add Skill
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {skills.length === 0 ? (
          <p className="text-sm text-neutral-400">No skills yet.</p>
        ) : (
          skills.map((skill) =>
            editingId === skill.id ? (
              <form
                key={skill.id}
                action={async (formData) => {
                  await updateSkill(formData);
                  setEditingId(null);
                }}
                className="flex flex-wrap items-end gap-3 rounded-lg border border-blue-800 bg-neutral-900 p-4"
              >
                <input type="hidden" name="id" value={skill.id} />
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-neutral-400">Name</label>
                  <input name="name" type="text" defaultValue={skill.name} required className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-neutral-400">Category</label>
                  <input
                    name="category"
                    type="text"
                    defaultValue={skill.category ?? ""}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-neutral-400">Proficiency</label>
                  <input
                    name="proficiency"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={skill.proficiency}
                    className={`${inputClass} w-24`}
                  />
                </div>
                <label className="flex items-center gap-2 pb-2 text-sm text-neutral-300">
                  <input type="checkbox" name="published" defaultChecked={skill.published} />
                  Published
                </label>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div
                key={skill.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white">{skill.name}</span>
                  {skill.category && (
                    <span className="text-xs text-neutral-500">{skill.category}</span>
                  )}
                  <span className="text-xs text-neutral-500">{skill.proficiency}%</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      skill.published
                        ? "bg-green-600/15 text-green-400"
                        : "bg-neutral-700/40 text-neutral-400"
                    }`}
                  >
                    {skill.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setEditingId(skill.id)}
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <form action={toggleSkillPublish}>
                    <input type="hidden" name="id" value={skill.id} />
                    <button type="submit" className="text-neutral-300 underline hover:text-white">
                      {skill.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteSkill}>
                    <input type="hidden" name="id" value={skill.id} />
                    <button type="submit" className="text-red-400 underline hover:text-red-300">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}
